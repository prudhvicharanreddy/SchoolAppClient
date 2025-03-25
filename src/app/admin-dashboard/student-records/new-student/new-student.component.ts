
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService ,Class} from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-student',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-student.component.html',
  styleUrl: './new-student.component.css'
})
export class NewStudentComponent implements OnInit {
  uniqueClassNames: string[] = []; 
  filteredSections: any;
  uniqueSectionNames: any;
  static fetchClasses() {
    throw new Error('Method not implemented.');
  }
  classes: Class[] = [];
  sections: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['studentData']) {
      this.initializeForm();
    }
  }

  @Input() studentData: any; 
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  studentForm!: FormGroup 
    constructor(private fb: FormBuilder,
      private AdminService:AdminService,
    private toastr:ToastrService) {
    
  }

  ngOnInit(){
    
    this.initializeForm();
    this.fetchClasses();
   
  }

  private initializeForm(){
this.studentForm = this.fb.group({
      studentId: [this.studentData?.studentId || null],
      firstName: [this.studentData?.studentFirstName || '', Validators.required],
      lastName: [this.studentData?.studentLastName || '', Validators.required],
      email: [this.studentData?.email || '', [ Validators.email]],
      phoneNumber:[this.studentData?.phoneNumber || '',[Validators.minLength(10),Validators.maxLength(10)]],
      className:[this.studentData?.className || ''],
      sectionName:[this.studentData?.sectionName || ''],
      password:[this.generatePassword(),[Validators.required]]
    
    });
  }

  // Add this function to generate password
  private generatePassword(length: number = 8): string {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const digits='0123456789'
    
   // Ensure at least one of each required type
  const passwordChars = [
    alphanumeric[Math.floor(Math.random() * alphanumeric.length)],  // At least 1 letter
    digits[Math.floor(Math.random() * digits.length)],     // At least 1 digit
    specialChars[Math.floor(Math.random() * specialChars.length)] // At least 1 special
  ];
    // Add remaining characters from combined set
    const allChars = alphanumeric + specialChars+digits;
    for (let i = 1; i < length; i++) {
      passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    // Shuffle to avoid predictable position of special character
    return passwordChars
      .sort(() => Math.random() - 0.5)
      .join('');
  }
    onCancel() {
      
      this.cancel.emit();
      
    
    }
  
    onSubmit(){
      if (this.studentForm.valid) {
        this.save.emit(this.studentForm.value);
      }
    }
    
    

    public fetchClasses(): void {
      this.AdminService.getClasses().subscribe({
        next: (response) => {
          this.classes= response;
          
          // Get unique class names
          this.uniqueClassNames = [...new Set(response.map(c => c.className))];
          this.uniqueSectionNames=[...new Set(response.map(c => c.sectionName))];//added new
        },
         error: (err) => this.toastr.error('Failed to load students', 'Error')
       });
    }

}
