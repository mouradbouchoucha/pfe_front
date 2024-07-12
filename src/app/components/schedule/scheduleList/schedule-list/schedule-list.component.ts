import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DateSelectArg, EventClickArg, EventApi, CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Subscription } from 'rxjs';
import { AddScheduleModalComponent } from '../../add-schedule-modal/add-schedule-modal.component';
import { EditScheduleModalComponent } from '../../edit-schedule-modal/edit-schedule-modal/edit-schedule-modal.component';
import { ScheduleService } from 'src/app/services/schedule/schedule.service';
import { ActivatedRoute } from '@angular/router';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  id!: number;
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    //  height: 'auto',
     contentHeight: '90vh',
     expandRows: true,
    initialView: 'timeGridWeek',
    initialDate: new Date(),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    firstDay: 1,
    slotMinTime: '08:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '00:30:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
  };

  currentEvents: EventApi[] = [];
  schedules: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private dialogService: DialogServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('courseId');
    if (idParam) {
      this.id = +idParam; 
      console.log(this.id);
      this.loadSchedules();
    } else {
      console.error('Invalid ID parameter');
    }
  }

  ngAfterViewInit() {
    this.updateCalendarEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadSchedules() {
    this.subscriptions.add(
      this.scheduleService.getScheduleByCourseId(this.id).subscribe(
        (schedules: any[]) => {
          console.log('Schedules loaded:', schedules);
          this.schedules = schedules;
          this.updateCalendarEvents();
        },
        error => {
          console.error('Error loading schedules:', error);
        }
      )
    );
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const startStr = selectInfo.startStr;
    const endStr = selectInfo.endStr;

    // Calculate the duration in milliseconds
    const start = new Date(startStr);
    const end = new Date(endStr);
    const durationMs = end.getTime() - start.getTime();

    // Convert duration to hours
    const durationHours = durationMs / (1000 * 60 * 60);
    console.log(startStr,start);
    // Check for existing schedule asynchronously
    this.scheduleService.checkForScheduleByStartDateTime(selectInfo.startStr, this.id).subscribe(
        (exist: boolean) => {
            if (exist) {
                // Fetch the existing schedule details if a schedule exists
                this.scheduleService.getScheduleByStartDateTime(selectInfo.startStr).subscribe(
                    (existingSchedule) => {
                        const dialogRef = this.dialog.open(EditScheduleModalComponent, {
                            width: '600px',
                            data: existingSchedule // Pass the existing schedule data to the Edit component
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            if (result) {
                                // Find the index of the updated schedule and replace it in the schedules array
                                const index = this.schedules.findIndex(schedule => schedule.id === result.id);
                                if (index !== -1) {
                                    this.schedules[index] = result;
                                    this.updateCalendarEvents();
                                }
                            }
                        });
                    },
                    error => {
                        console.error('Error fetching existing schedule details:', error);
                    }
                );
            } else {
                // Check for overlapping schedules
                if (this.isTimeSlotAvailable(start, end)) {
                  console.log(startStr, endStr);
                    const dialogRef = this.dialog.open(AddScheduleModalComponent, {
                        width: '600px',
                        data: { courseId: this.id, startDateTime: startStr, endDateTime: endStr, duration: durationHours },
                        
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.schedules.push(result);
                            this.updateCalendarEvents();
                        }
                    });
                } else {
                  this.snackBar.open('The selected time slot overlaps with an existing schedule.', 'close', { duration: 6000 });
                }
            }
        },
        error => {
            console.error('Error checking schedule existence:', error);
        }
    );
}

isTimeSlotAvailable(start: Date, end: Date): boolean {
    for (let schedule of this.schedules) {
        const scheduleStart = new Date(schedule.startDateTime);
        const scheduleEnd = new Date(schedule.startDateTime);
        scheduleEnd.setHours(scheduleEnd.getHours() + schedule.duration);

        if ((start < scheduleEnd && start >= scheduleStart) || (end > scheduleStart && end <= scheduleEnd)) {
            return false; // Time slot overlaps with an existing schedule
        }
    }
    return true; // Time slot is available
}


  handleEventClick(clickInfo: EventClickArg) {

    console.log(clickInfo.event);
    const { id, title, startStr, endStr } = clickInfo.event;
    console.log(id);
    // Calculate the duration in milliseconds
    const start = new Date(startStr);
    const end = new Date(endStr);
    const durationMs = end.getTime() - start.getTime();

    // Convert duration to hours
    const durationHours = durationMs / (1000 * 60 * 60);

    console.log("Event clicked:", id, title, "Duration (hours):", durationHours);

    const dialogRef = this.dialog.open(EditScheduleModalComponent, {
      width: '600px',
      data: { id, title, start: startStr, end: endStr, duration: durationHours }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.schedules.findIndex(schedule => schedule.id === result.id);
        if (index !== -1) {
          this.schedules[index] = result;
          this.updateCalendarEvents();
        }
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  updateCalendarEvents() {
    console.log('Updating calendar events with schedules:', this.schedules);
    const events = this.schedules.map((schedule) => ({
      id: schedule.id.toString(),
      title: `${schedule.subject?.name ?? 'No Subject'} - ${schedule.trainer?.firstName ?? 'No Trainer'}`,
      start: schedule.startDateTime,
      end: this.getEndDateTime(schedule.startDateTime, schedule.duration),
    }));

    console.log('Events to add to calendar:', events);

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(events);
  }

  getEndDateTime(startDateTime: string, duration: number): string {
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    return end.toISOString();
  }
}
