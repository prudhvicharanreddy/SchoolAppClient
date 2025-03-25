import { Component, OnInit } from '@angular/core';
// import { StudentService, Student, SubjectGrade } from '../student.service';

@Component({
  selector: 'app-student-details',
  imports: [],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent  {
//     studentData: Student | undefined;
//     totalScore = 0;
//     maxTotal = 0;
  
//     constructor(private studentService: StudentService) { }
  
//     ngOnInit(): void {
//       this.studentService.getStudentData().subscribe(data => {
//         this.studentData = data;
//         this.calculateTotals();
//       });
//     }
  
//     private calculateTotals(): void {
//       if (this.studentData) {
//         this.totalScore = this.studentData.grades.reduce((sum, grade) => sum + grade.score, 0);
//         this.maxTotal = this.studentData.grades.reduce((sum, grade) => sum + grade.total, 0);
//       }
//     }
  
//     getProgressWidth(score: number, total: number): string {
//       return `${(score / total) * 100}%`;
//     }
  

}
