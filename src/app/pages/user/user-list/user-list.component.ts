import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../../../@theme/services/media.service';
import { UserService } from '../../../@theme/services/user.service';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  isDesktop: boolean = false;
  private mediaService = new MediaService('(min-width: 768px)');
  loading = false;
  usersList = [
    {
      firstName: "Mohan",
      lastName: "Bhombe",
      email: "mohan.autotech@gmail.com",
      phone: "9876543210",
      address: "A/211, Union Heights"
    },
    {
      firstName: "Mohan",
      lastName: "Bhombe",
      email: "mohan.autotech@gmail.com",
      phone: "9876543210",
      address: "A/211, Union Heights"
    },
    {
      firstName: "Mohan",
      lastName: "Bhombe",
      email: "mohan.autotech@gmail.com",
      phone: "9876543210",
      address: "A/211, Union Heights"
    },
    {
      firstName: "Mohan",
      lastName: "Bhombe",
      email: "mohan.autotech@gmail.com",
      phone: "9876543210",
      address: "A/211, Union Heights"
    }
  ];
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {

    this.mediaService.match$.subscribe(value => this.isDesktop = value);
    // this.getUsersList();
  }

  getUsersList() {

    this.loading = true;
    this.usersList = [];

    this.userService.getAllPartyList().subscribe((data: any) => {
      if (data["success"]) {
        this.usersList = data.data;
      }
      this.loading = false;
    },
      (error) => {

      }
    );
  }

  openRecord(user?) {

    if (user) {
      this.router.navigate(["pages/user/edit/" + user._id]);
    } else {
      this.router.navigate(["pages/user/add"]);
    }

  }

}


