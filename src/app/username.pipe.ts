import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  transform([messageObj, users]): string {
    console.log(messageObj);
    console.log('users obj', Object.keys(users), Object.values(users));
    console.log(users[messageObj.userId] || messageObj.userName);
    return (users[messageObj.userId] || messageObj.userName);
  }

}
