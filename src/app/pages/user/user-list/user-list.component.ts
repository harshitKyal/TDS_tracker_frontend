import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../../../@theme/services/media.service';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  isDesktop:boolean = false;
  private mediaService = new MediaService('(min-width: 768px)');
  constructor(private router:Router) { }

  ngOnInit(): void {

    this.mediaService.match$.subscribe(value => this.isDesktop = value);
  }

  openRecord(){

    this.router.navigate(["pages/user/add"]);
  }

}
