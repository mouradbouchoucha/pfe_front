export interface Course {
    id?: number;
    name: string;
    description: string;
    duration: number;
    startDateTime: Date;
    imageFile?: File;
}
