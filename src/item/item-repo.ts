import { Knex } from "knex";
import connection from "../db/connection";
import { Item, ItemDBRow, PurchaseItem } from "./types";

export class ItemRepo {
  private itemDB;

  /**
   * Item repository
   * @param itemDB Database connection
   */
  constructor(itemDB: Knex<any, unknown[]>) {
    this.itemDB = itemDB;
  }

  /**
   * query joining tags with items
   */
  private get joinTagsQuery() {
    return this.itemDB('items')
      .join('tags', 'items.tag_id', 'tags.id')
      .select(
        'items.id as id, user_id, price, purchase_date, tags.name as tag_name, items.description as items_description'
      );
  }

  /**
   * Add a new purchase item to database
   * @param purchaseItem item to be added to db
   * @returns inserted item
   */
  async addItem(purchaseItem: Item) {
    try {
      const [item] = await this.itemDB('items')
        .insert(purchaseItem)
        .returning('*');
      return item as ItemDBRow;
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * 
   * @param purchaseItems items to be added to db
   * @returns inserted item
   */
  async addMultipleItem(purchaseItems: Item[]) {
    try {
      const items = await this.itemDB('items')
        .insert(purchaseItems)
        .returning('*');
      return items as ItemDBRow[];
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }


  async getItem(id: number) {
    try {
      const [item] = await this.itemDB('items').where('items.id', id);
      return item as ItemDBRow || null;
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * get items in range, sort by id.
   * @param prevID id to start taking items. not inclusive
   * @param limit defaul 100;
   * @returns array of user items.
   */
  async getItems(prevID: number = 0, limit: number = 100) {
    try {
      let items = await this.itemDB('items')
        .where('items.id', '<', prevID)
        .orderBy('items.id', 'desc')
        .limit(limit);
      return items as ItemDBRow[];
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * get user items in range, sort by id.
   * @param userID user id
   * @param prevID id to start taking items, 
   * @param limit default 100
   * @returns array of user items.
   */
  async getUserItems(userID: string, prevID: number = 0, limit: number = 100) {
    try {
      let items = await this.itemDB('items')
        .where('user_id', userID)
        .andWhere('items.id', '<', prevID)
        .orderBy('items.id', 'desc')
        .limit(limit);
      return items as ItemDBRow[];
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * get a list of a user's item corresponding to a list of item ids.
   * @param userID user id
   * @param itemIDs array of item ids
   */
  async getUserItemList(userID: string, itemIDs: number[]) {
    try {
      const items = await this.itemDB('items')
        .whereIn('items.id', itemIDs)
        .andWhere('user_id', userID);
      return items as ItemDBRow[];
    } catch (err) {

    }
  }

  /**
   * delete an item
   * @param itemID 
   */
  async deleteItem(itemID: number) {
    try {
      await this.itemDB('items').where('id', itemID).del();
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * delete a list of items
   * @param itemIDs list of ids for items to be deleted.
   * @returns number of rows affected.
   */
  async deleteItems(itemIDs: number[]) {
    try {
      const results = await this.itemDB('items')
        .whereIn('id', itemIDs)
        .del()
      return results;
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }

  /**
   * update item
   * @param itemID 
   * @param updateItem items details to be updated
   * @returns newly updated item.
   */
  async updateItem(itemID: number, updateItem: Partial<ItemDBRow>) {
    try {
      const [result] = await this.itemDB('items')
        .update(updateItem)
        .where('id', itemID)
        .returning('*');
      return result as ItemDBRow;
    } catch (err) {
      console.error(err);
      throw new Error('DB Error');
    }
  }
}

const defaultRepo = new ItemRepo(connection);
export default defaultRepo;