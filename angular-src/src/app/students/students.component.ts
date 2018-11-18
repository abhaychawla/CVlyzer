import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { StudentsService } from './students.service';

import { Student } from './student.model';
import { Query } from './query.model';

interface FilterOptions {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'cvlyzer-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  applicantList: Student[] = [];
  dataSource: MatTableDataSource<Student>;

  displayedColumns: string[] = ['name', 'email', 'profiles', 'downloadResume', 'viewApplicant', 'deleteApplicant'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterFormControl = new FormControl(true);

  masterSearchKeywords: string[] = [];
  query: Query =  {
    education: [],
    experience: [],
    skills: [],
    certification: [],
    projects: []
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  filterOptions: FilterOptions[] = [
    {
      value: true,
      viewValue: 'Master Search'
    },
    {
      value: false,
      viewValue: 'Sub-Section Search'
    }
  ];

  constructor(private studentsService: StudentsService) { }

  ngOnInit() {
    this.studentsService.getApplicants().subscribe((applicants: any) => {
      this.applicantList = applicants;
      this.setTable();
    });
    this.filterFormControl.valueChanges.subscribe(() => {
      this.masterSearchKeywords = [];
      this.query = {
        education: [],
        experience: [],
        skills: [],
        certification: [],
        projects: []
      };
    });
  }

  /**
   * Search by Query
   */

  addEducation(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.query.education.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeEducation(value: string): void {
    const index = this.query.education.indexOf(value);
    if (index >= 0) {
      this.query.education.splice(index, 1);
    }
    this.resetTableIfQueryEmpty();
  }

  addExperience(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.query.experience.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeExperience(value: string): void {
    const index = this.query.experience.indexOf(value);
    if (index >= 0) {
      this.query.experience.splice(index, 1);
    }
    this.resetTableIfQueryEmpty();
  }

  addSkills(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.query.skills.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeSkills(value: string): void {
    const index = this.query.skills.indexOf(value);
    if (index >= 0) {
      this.query.skills.splice(index, 1);
    }
    this.resetTableIfQueryEmpty();
  }

  addCertification(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.query.certification.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeCertification(value: string): void {
    const index = this.query.certification.indexOf(value);
    if (index >= 0) {
      this.query.certification.splice(index, 1);
    }
    this.resetTableIfQueryEmpty();
  }

  addProjects(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.query.projects.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeProjects(value: string): void {
    const index = this.query.projects.indexOf(value);
    if (index >= 0) {
      this.query.projects.splice(index, 1);
    }
    this.resetTableIfQueryEmpty();
  }

  resetTableIfQueryEmpty() {
    if (this.query.education.length === 0 && this.query.skills.length === 0 && this.query.experience.length === 0 && this.query.projects.length === 0 && this.query.certification.length === 0) {
      this.setTable();
    }
  }

  /**
   * Master Search
   */

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.masterSearchKeywords.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(value: string): void {
    const index = this.masterSearchKeywords.indexOf(value);
    if (index >= 0) {
      this.masterSearchKeywords.splice(index, 1);
    }
    if (this.masterSearchKeywords.length === 0) {
      this.setTable();
    }
  }

  /**
   *
   */
  search() {
    if (this.filterFormControl.value) {
      if (this.masterSearchKeywords.length !== 0) {
        this.studentsService.masterSearch(this.masterSearchKeywords).subscribe((response: any) => {
          this.setTable(response);
        });
      } else {
        this.setTable();
      }
    } else {
      if (this.query.education.length !== 0 || this.query.experience.length !== 0 || this.query.skills.length !== 0 ||
        this.query.certification.length !== 0 || this.query.projects.length !== 0) {
        this.studentsService.subSectionSearch(this.query).subscribe((response: any) => {
          this.setTable(response);
        });
      } else {
        this.setTable();
      }
    }
  }

  setTable(data?: any) {
    if (data) {
      this.dataSource = new MatTableDataSource<Student>(data);
    } else {
      this.dataSource = new MatTableDataSource<Student>(this.applicantList);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   *
   */
  delete(filename: string, id: string) {
    this.studentsService.deleteApplicant(filename, id).subscribe((id: any) => {
      this.applicantList = this.applicantList.filter((applicant: Student) => {
        return applicant.id !== id;
      });
      this.setTable();
    });
  }

}
