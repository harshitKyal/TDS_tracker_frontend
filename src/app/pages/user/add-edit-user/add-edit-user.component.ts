import { NbToastrService } from '@nebular/theme';
import { NbThemeService } from '@nebular/theme';
import { Apollo, gql } from 'apollo-angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../../../@theme/services/media.service';

@Component({
  selector: 'ngx-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  isDesktop: boolean = false;
  private mediaService = new MediaService('(min-width: 768px)');
  currentUserId = null;
  userObject: User;
  formSubmitted = false;
  permissionArray = [
    {
      name: 'User',
      selectAll: false,
      view: false,
      add: false,
      edit: false,
      delete: false
    },
    {
      name: 'Supplier',
      selectAll: false,
      view: false,
      add: false,
      edit: false,
      delete: false
    },
    {
      name: 'Firm',
      selectAll: false,
      view: false,
      add: false,
      edit: false,
      delete: false
    },
    {
      name: 'Payment',
      selectAll: false,
      view: false,
      add: false,
      edit: false,
      delete: false
    }

  ]

  loading = false;
  editable = false;

  constructor(private _route: ActivatedRoute, private apollo: Apollo, private toaster: NbToastrService,
    private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.mediaService.match$.subscribe(value => this.isDesktop = value);

    this.currentUserId = this._route.snapshot.paramMap.get("id");
    if (this.currentUserId != null) {
      this.getUserUpdateData();
    } else {
      this.userObject = new User();
      this.userObject.permission = this.permissionArray;
    }

  }

  makeEdittable() {
    this.editable = true;
    this.cdr.detectChanges();
  }

  deleteRecord() {

    this.loading = true;
    this.apollo.mutate({
      mutation: gql`mutation Users($type: String, $id: String) {
        users(type: $type, _id: $id) {
          _id
        }
      }`,
      variables: {
        "type": "delete",
        "id": this.currentUserId
      }
    }).subscribe(result => {
      this.toaster.success("User deleted", "Delete");
      this.loading = false;
      this.router.navigate(['pages/user']);
    },
      (error) => {
        console.log(error);
        this.loading = false;
      });

  }

  // backToView() {
  //   this.editable = false;
  //   this.userObject = this.copyUserData;
  //   this.cdr.detectChanges();
  // }

  copyUserData: User;
  getUserUpdateData() {

    this.userObject = new User();
    const getUserById = gql`
    query Query($id: String) {
      users(_id: $id) {
        _id
        email
        userName
        firstName
        lastName
        password
        mobile
        firm {
          _id
          name
          address
          GST
        }
        permission
      }
    }
    `
    this.loading = true;
    this.apollo
      .watchQuery({
        query: getUserById,
        fetchPolicy: "network-only",
        variables: { "id": this.currentUserId }

      })
      .valueChanges.subscribe((data: any) => {
        let tempData = data['data'].users[0];
        let moduleObject = tempData.permission;
        if (moduleObject) {

          let userModuleKeys = Object.keys(moduleObject);
          let temp = [];
          if (userModuleKeys && userModuleKeys.length) {

            userModuleKeys.forEach(ele => {
              let obj = {
                name: ele,
                selectAll: false,
                view: moduleObject[ele][1],
                add: moduleObject[ele][0],
                edit: moduleObject[ele][2],
                delete: moduleObject[ele][3]
              }

              if (obj.add && obj.view && obj.edit && obj.delete) {
                obj.selectAll = true;
              }

              temp.push(obj);
            });

            this.userObject.permission = [];
            this.userObject.permission = [...temp];

            this.userObject.firstName = tempData.firstName;
            this.userObject.lastName = tempData.lastName;
            this.userObject.email = tempData.email;
            this.userObject.userName = tempData.userName;
            this.userObject.mobile = tempData.mobile;
            this.userObject.password = tempData.password;
            this.userObject.id = tempData._id;
            this.copyUserData = this.userObject;
          }
        }

        this.loading = false;
      },
        (error) => {
          console.log(error);
          this.loading = false;
        });



  }

  submit(userForm) {

    let temp = {};
    this.userObject.permission.forEach(element => {
      temp[element.name] = [element.add, element.view, element.edit, element.delete];
    });

    this.userObject.permission = temp;
    this.formSubmitted = true;
    if (userForm.valid) {
      this.userObject.type = "register";
      this.loading = true;
      this.apollo.mutate({
        mutation: gql`mutation($type: String, $email: String,
                              $userName: String, $firstName: String,
                              $lastName: String, $password: String,
                              $mobile: String, $firmId: String, $permission: JSON) {
                                users(type: $type, email: $email, userName: $userName,
                                      firstName: $firstName, lastName: $lastName, password: $password,
                                      mobile: $mobile, firmId: $firmId, permission: $permission) {
                                        _id
                                        email
                                        userName
                                        firstName
                                        lastName
                                        password
                                        mobile
                                        firmId
                                        firm {
                                          _id
                                          name
                                          address
                                          GST
                                        }
                                        permission
                                }
                              }`,
        variables: this.userObject
      }).subscribe(result => {
        this.toaster.success("User creadted", "Create");
        this.loading = false;
        this.router.navigate(['pages/user']);
      },
        (error) => {
          console.log(error);
          this.loading = false;
        });
    } else {
      this.toaster.danger("Enter Required Fields", "Validation Error");
      this.loading = false;
    }


  }

  update(userForm) {

    let temp = {};
    this.userObject.permission.forEach(element => {
      temp[element.name] = [element.add, element.view, element.edit, element.delete];
    });

    this.userObject.permission = temp;
    delete this.userObject.password;
    this.formSubmitted = true;
    if (userForm.valid) {
      this.userObject.type = "update";
      this.loading = true;
      this.apollo.mutate({
        mutation: gql`mutation Users($type: String, $id: String, $email: String,
                                    $userName: String, $firstName: String, $lastName: String,
                                    $mobile: String, $permission: JSON) {
                                      users(type: $type, _id: $id, email: $email, userName: $userName,
                                        firstName: $firstName, lastName: $lastName, mobile: $mobile,
                                        permission: $permission) {
                                          _id
                                          email
                                          userName
                                          firstName
                                          lastName
                                          mobile
                                          firm {
                                            _id
                                            name
                                            address
                                            GST
                                          }
                                          permission
                                        }
                                      }`,
        variables: this.userObject
      }).subscribe(result => {
        this.toaster.success("User updated", "Update");
        this.loading = false;
        this.router.navigate(['pages/user']);
      },
        (error) => {
          console.log(error);
          this.loading = false;
        });
    } else {
      this.toaster.danger("Enter Required Fields", "Validation Error");
      this.loading = false;
    }


  }

  selectAllChecked(permission, type?) {

    if (type) {

      if (permission.add == true && permission.edit == true && permission.delete == true && permission.view == true) {
        permission.selectAll = true;
      } else {
        permission.selectAll = false;
      }

    } else {
      if (permission.selectAll) {

        permission.add = true;
        permission.edit = true;
        permission.delete = true;
        permission.view = true;

      } else {

        permission.add = false;
        permission.edit = false;
        permission.delete = false;
        permission.view = false;

      }
    }


  }

  createUser() {
    console.log(this.userObject);
  }
}


export class User {

  id: string;
  type: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  mobile: string;
  firmId: string;
  permission: any;

  constructor() {
    this.id = ''
    this.type = '';
    this.email = '';
    this.userName = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.mobile = '';
    this.firmId = null;
    this.permission = [];
  }
}
