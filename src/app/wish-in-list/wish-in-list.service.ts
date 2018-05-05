import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Wish } from '../interfaces/wish';
import { Constants } from '../services/constants.service';
import { LS } from '../services/local-storage.service';
import { UUID } from 'angular2-uuid';
import { ApiService } from '../api/api.service';
import { WishService } from '../wish/wish.service';
import { BaseWishListService } from '../wish-list/base-wish-list.service';

@Injectable()
export class WishInListService {
  private mode = Constants.Modes.Guest;
  private wishes: Wish[] = [];

  constructor(
    private apiService: ApiService,
    private ls: LS,
    private baseWishListService: BaseWishListService,
  ) { }

  toggleWishStatus(id: string): Promise<Wish[]> {
    console.log('toggleStatus');
    return new Promise<Wish[]>((resolve, reject) => {
      switch (this.mode) {
        case Constants.Modes.Guest:
          for (let i = 0; i < this.wishes.length; i++) {
            const wish = this.wishes[i];
            console.log('wish =', wish);
            if (wish.id === id) {
              wish.done = !wish.done;
              this.ls.updateWish(wish);
              break;
            }
          }
          resolve(this.wishes);
          break;

        case Constants.Modes.User:
          break;
      }
    });
  }

  deleteWish(wish: Wish): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      switch (this.mode) {
        case Constants.Modes.Guest:
          this.wishes = this.wishes.filter(w => w !== wish);
          this.ls.deleteWish(wish.id);
          resolve();
          break;

        case Constants.Modes.User:
          break;
      }
    });
  }

  changeWishField(wish: Wish, field: string, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      switch (this.mode) {
        case Constants.Modes.Guest:
          const _wish = this.ls.getWish(wish.id);
          _wish[field] = value;
          this.ls.updateWish(_wish);
          resolve();
          break;

        case Constants.Modes.User:
          break;
      }
    });
  }

}

