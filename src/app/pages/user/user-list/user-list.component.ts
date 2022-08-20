import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Apollo, gql } from 'apollo-angular';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs';
import { MediaService } from '../../../@theme/services/media.service';
import { UserService } from '../../../@theme/services/user.service';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';

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
  sortObject = {
    firstName: '',
    lastName: '',
    email: '',
    userName: ''
  };
  userRequestModal: UsersRequestModal;
  user$!: Observable<any>;

  constructor(private router: Router, private userService: UserService, private apollo: Apollo,
    private dialog: NbDialogService) { }

  ngOnInit(): void {

    this.mediaService.match$.subscribe(value => this.isDesktop = value);
    this.userRequestModal = new UsersRequestModal();
    this.getUsersList();
  }

  getUsersList() {

    const allUsers = gql`
    query Users($page: Int, $limit: Int, $sort: String, $filterKeysArray: [String], $searchValue: String) {
      users(page: $page, limit: $limit, sort: $sort, filterKeysArray: $filterKeysArray, searchValue: $searchValue) {
        _id
        email
        userName
        firstName
        lastName
        mobile
        permission
        password
        firm {
          GST
          address
          name
          _id
        }
      }
    }
    `;

    this.loading = true;
    this.apollo.watchQuery<any>({
      query: allUsers,
      variables: {
        page: this.userRequestModal.page,
        limit: this.userRequestModal.limit,
      },
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe((data: any) => {
      this.usersList = [...this.usersList, ...data['data'].users];
      this.userRequestModal.page = this.userRequestModal.page + 1;
      this.loading = false;
    },
      (error) => {
        console.log(error);
        this.loading = false;
      });

  }

  soryByField(keyName) {

    if (this.sortObject[keyName] == '') {
      let list = sortBy(this.usersList, keyName, 'asc');
      this.usersList = [...list];
      this.sortObject[keyName] = 'asc';
    } else if (this.sortObject[keyName] == 'asc') {
      let list = sortBy(this.usersList, keyName, 'asc').reverse();
      this.usersList = [...list];
      this.sortObject[keyName] = 'desc';
    } else {
      this.getUsersList();
      this.sortObject[keyName] = '';
    }

  }

  openRecord(user?) {

    if (user) {
      this.router.navigate(["pages/user/edit/" + user._id]);
    } else {
      this.router.navigate(["pages/user/add"]);
    }

    // this.dialog.open(AddEditUserComponent)
    //   .onClose.subscribe(name => name);

  }

  async scrollHandler() {

    const scrollContainer = document.getElementById("statusScroll");

    if (scrollContainer) {

      let diff = scrollContainer.scrollTop - (scrollContainer.scrollHeight - scrollContainer.offsetHeight);

      if (diff >= -1 && diff <= 5) {
        this.getUsersList();

      }
    }
  }
}

export class UsersRequestModal {

  page: number;
  limit: number;

  constructor() {
    this.page = 1;
    this.limit = 10;
  }
}
