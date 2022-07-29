import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../../@theme/services/media.service';

@Component({
  selector: 'ngx-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

  isDesktop:boolean = false;
  private mediaService = new MediaService('(min-width: 768px)');
  constructor() { }

  ngOnInit(): void {

    this.mediaService.match$.subscribe(value => this.isDesktop = value);
  }

}
