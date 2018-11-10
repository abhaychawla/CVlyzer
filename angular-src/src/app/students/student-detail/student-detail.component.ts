import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StudentsService } from '../students.service';

@Component({
  selector: 'cvlyzer-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  applicant: any;

  constructor(private route: ActivatedRoute,
              private studentsService: StudentsService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.studentsService.getApplicantDetails(id)
      .subscribe((applicant: any) => {
        this.applicant = applicant;
      });
  }

}
