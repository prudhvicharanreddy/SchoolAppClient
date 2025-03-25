import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgForm,FormGroup,FormBuilder,Validators,FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-teacher',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-teacher.component.html',
  styleUrl: './new-teacher.component.css'
})
export class NewTeacherComponent {
  classes: any[] = [];
  uniqueClassNames: string[] = [];
  classSectionMap: { [key: string]: string[] } = {};


  ngOnChanges(changes: SimpleChanges) {
    if (changes['teacherData']) {
      this.initializeForm();
    }

  }

  @Input() teacherData: any; // Add this input
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  teacherForm!: FormGroup 
    constructor(private fb: FormBuilder,
      private AdminService:AdminService,
      private toastr:ToastrService
    ) {
    
  }

  ngOnInit(){
     this.initializeForm();
     this.fetchClasses();
  }

  private initializeForm(){
this.teacherForm = this.fb.group({
      teacherId: [this.teacherData?.teacherId || null],
      firstName: [this.teacherData?.firstName || '', Validators.required],
      lastName: [this.teacherData?.lastName || '', Validators.required],
      email: [this.teacherData?.email || '', [ Validators.email]],
      phoneNumber:[this.teacherData?.phoneNumber || '',[Validators.minLength(10),Validators.maxLength(10)]],
      password:[this.generatePassword(),[Validators.required]],
      classAssignments: this.fb.array(
        this.teacherData?.classAssignments?.map((ca: any) => this.createClassAssignment(ca)) || 
        [this.createClassAssignment()]
      )
    
    });
  }
  createClassAssignment(assignment?: any): FormGroup {
    return this.fb.group({
      className: [assignment?.className || '', Validators.required],
      sectionName: [assignment?.sectionName || '', Validators.required],
      subjectName: [assignment?.subjectName || '', Validators.required]
    });
  }

  get classAssignments() {
    return this.teacherForm.get('classAssignments') as FormArray;
  }

  addClassAssignment() {
    this.classAssignments.push(this.createClassAssignment());
  }

  removeClassAssignment(index: number) {
    this.classAssignments.removeAt(index);
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
      if (this.teacherForm.valid) {
        this.save.emit(this.teacherForm.value);
      }
    }


    public fetchClasses(): void {
      this.AdminService.getClasses().subscribe({
        next: (response) => {
          this.classes= response; 
          // Get unique class names
          this.uniqueClassNames = [...new Set(response.map(c => c.className))];
          // Create class-section mapping
        this.classSectionMap = response.reduce((acc: any, curr: any) => {
          if (!acc[curr.className]) {
            acc[curr.className] = [];
          }
          if (!acc[curr.className].includes(curr.sectionName)) {
            acc[curr.className].push(curr.sectionName);
          }
          return acc;
        }, {});
        },
         error: (err) => this.toastr.error('Failed to load students', 'Error')
       });
    }
    
    getSections(index: number): string[] {
      const selectedClass = this.classAssignments.at(index).get('className')?.value;
      return selectedClass ? this.classSectionMap[selectedClass] || [] : [];
    }
    
    onClassChange(index: number, event: any) {
      // Reset section when class changes
      this.classAssignments.at(index).get('sectionName')?.setValue('');
    }
}

