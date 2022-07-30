import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private _route:ActivatedRoute) { }

  ngOnInit(): void {
    this.mediaService.match$.subscribe(value => this.isDesktop = value);

    this.currentUserId = this._route.snapshot.paramMap.get("id");
    if (this.currentUserId != null) this.getUserUpdateData();
  }

  getUserUpdateData(){

  }

}
