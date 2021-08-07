import {Component, OnInit} from '@angular/core';
import {MarkdownService} from 'ngx-markdown';
import {DescriptionService} from './services/description.service';

@Component({
  selector: 'btc-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  public description?: string | undefined;

  constructor(public descriptionService: DescriptionService, public markdownService: MarkdownService) {
  }


  ngOnInit(): void {

    this.descriptionService.description.subscribe(description => this.description = description);


    this.markdownService.renderer.link = (href: string, title: string, text: string) => {
      const escapedText = text?.toLowerCase().replace(/[^\w]+/g, '-');
      const escapedHref = href?.toLowerCase().replace(/[^\w]+/g, '-');
      return '<a href="' + href + '" target="_blank">  ' + text + '</a> ';
    };
  }

}
