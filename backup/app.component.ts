import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'ewc-boilerplate-angular-cli';
    button: any;
    data = [
        {"name": "Lisa", "email": "lisa@simpsons.com", "phone": "555-111-1224"},
        {"name": "Bart", "email": "bart@simpsons.com", "phone": "555-222-1234"},
        {"name": "Homer", "email": "homer@simpsons.com", "phone": "555-222-1244"},
        {"name": "Marge", "email": "marge@simpsons.com", "phone": "555-222-1254"}
    ]

    readyGrid = (event) => {
        console.log('readyGrid')
        //console.log(event)
        console.log(this.data)
        console.log(event.detail.cmp)
        event.detail.cmp.setData(this.data)
    }


    readyGrid2 = (event) => {
        console.log('readyGrid2')
        //console.log(event)
        console.log(this.data)
        console.log(event.detail.cmp)
        event.detail.cmp.setData(this.data)
    }


    readyButton = (event) => {
        //console.log('readyButton')
        //console.log(event)
        this.button = event.detail.cmp;
    }
    tapButton = (event) => {
        alert('button text: ' + this.button.getText())
    }
    focusButton = (event) => {
        console.log('focus')
    }

}
