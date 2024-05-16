export interface Trainer {
    // private Long id;
    // private String firstName;
    // private String lastName;
    // private String email;
    // private String phoneNumber;
    // private String address;
    // private String city;
    // private byte[] profilePicture;
    // private MultipartFile profilePictureFile;

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    profilePicture: File;
    actions?:{
        edit():void;
        delete():void;
    }
}
