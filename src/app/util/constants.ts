import {HttpHeaders} from "@angular/common/http";

export class Constants {
  public static domain: string = "localhost:7034"
  public static baseUrl: string = "https://localhost:7034/api"

  public static headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
  });
}
