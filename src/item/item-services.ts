import { AppError } from "../error";
import { ItemRepo, itemDAL } from "./";
import { Item, ItemDBRow } from "./types";

export class ItemServices {
  itemDAL: ItemRepo;

  constructor(itemRepo: ItemRepo) {
    this.itemDAL = itemRepo;
  }

  async getItem(userID: string, itemID: number) {
    const item = await this.itemDAL.getItem(itemID);
    if (item === null) throw new AppError('', 404, 'no such item', true);
    if (userID === item.user_id) {
      return item;
    } else {
      throw new AppError('', 400, 'permission denied', true);
    }

  }

  /**
   * Add an user purchase.
   * @param userID 
   * @param itemDetails 
   * @returns 
   */
  async addItem(userID: string, itemDetails: Item) {
    const newItem: Item = { ...itemDetails, user_id: userID };
    const item = await this.itemDAL.addItem(newItem);
    return item;
  }

  /**
   * add multiple user purchases.
   * @param userID user id
   * @param itemDetails items to be added
   */
  async addMultipleItems(userID: string, itemDetails: Item[]) {
    const newItems = itemDetails.map(item => ({ ...item, user_id: userID }));
    const items = await this.itemDAL.addMultipleItem(newItems);
    return items;
  }

  /**
   * update a user purchase item.
   * @param userID user id
   * @param updateDetails item details to be updated
   * @returns updated item.
   */
  async editItem(userID: string, updateDetails: ItemDBRow) {
    //check user has permission to edit the item.
    if (await this.isOwnItem(userID, updateDetails.id)) {
      throw new AppError('', 401, 'permission denied', true);
    }
    const updateItem = this.mapUpdateItem(updateDetails);
    const item = await this.itemDAL.updateItem(updateDetails.id, updateItem);
    return item;
  }

  async deleteItem() {

  }

  async deleteMultipleItems() {

  }


  /**
   * check that the user is the owner of the item
   * @param userID user id
   * @param itemID item id
   * @returns boolean
   */
  async isOwnItem(userID: string, itemID: number) {
    const itemDetails = await this.itemDAL.getItem(itemID);
    return userID === itemDetails.user_id;
  }


  /**
   * check item properties for update, only accept valid fields.
   * @param updateDetails 
   * @returns 
   */
  mapUpdateItem(updateDetails: Partial<Item>) {
    const { price, purchase_date, tag_id, name, description } = updateDetails
    const item: Partial<Item> = {};
    if (price) item.price = price;
    if (purchase_date) item.purchase_date = purchase_date;
    if (name) item.name = name;
    if (description) item.description = description;
    if (tag_id) item.tag_id = tag_id;
    return item;
  }

}

const defaultItemServices = new ItemServices(itemDAL);

export default defaultItemServices;