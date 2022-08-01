import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
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
  usersList = [];

  user$!: Observable<any>;
  constructor(private router: Router, private userService: UserService, private apollo: Apollo) { }

  ngOnInit(): void {

    this.mediaService.match$.subscribe(value => this.isDesktop = value);
    this.getUsersList();
  }

  getUsersList() {

    const allUsers = gql`
     query {
        users {
          _id
          firstName
          lastName
          email
          mobile
          userName
        }
      }
    `;

    this.loading = true;
    this.apollo
      .watchQuery({
        query: allUsers,
        fetchPolicy: "network-only",
      })
      .valueChanges.subscribe((data: any) => {
        this.usersList = data['data'].users;
        this.loading = false;
      },
        (error) => {
          console.log(error);
          this.loading = false;
        });

  }

  openRecord(user?) {

    if (user) {
      this.router.navigate(["pages/user/edit/" + user._id]);
    } else {
      this.router.navigate(["pages/user/add"]);
    }

  }

}


