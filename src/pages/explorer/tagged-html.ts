import { Component, ViewChild, ViewContainerRef, ComponentRef, Compiler, Injector, NgModuleRef, NgModule, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TaggedHtmlModule } from './tagged-html.module';

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'tagged-html',
  template: `<div #vc></div>`
})
export class TaggedHtml implements OnChanges {
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  @Input() html: string;

  private cmpRef: ComponentRef<any>;
  @Input() entities: any[];

  private partialQueries: string[];
  private partialResults: any[];

  constructor(private compiler: Compiler,
              private injector: Injector,
              private moduleRef: NgModuleRef<any>,
  ) {
      this.entities = [];
      //this.partialQueries = [];
      //this.partialResults = [];
  }

  //ngAfterViewInit() {
  //    if(this.html && this.html.length > 0)
  //        this.createComponentFromRaw(this.html);
  //}

  ngOnChanges(changes: SimpleChanges) {
      if (changes.entities || changes.html) {
          this.refreshComponent();
      }
  }

  refreshComponent() {
      this.destroyComponent();

      if (this.html && this.html.length > 0)
        this.createComponentFromRaw(this.html);
  }
    
  // Here we create the component.
  private createComponentFromRaw(template: string) {
    // Let's say your template looks like `<h2><some-component [data]="data"></some-component>`
    // As you see, it has an (existing) angular component `some-component` and it injects it [data]

      var styles: string[] = [
          `tagged-keyword{ 
            background: #f2fff2;
            padding: 3px 5px;
            margin: 1px 0;
            display: inline-block;
            border-radius: 3px;
            border: 1px solid green;
            border-style: dashed;
          }`
      ];

      // Transform html

      //this.entities
      //    .filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1)
      //    .map(entity => {
      //    entity.symbols.map(symbol => {
      //        //template = template.split(symbol).join(`<tagged-keyword kw="${symbol}"></tagged-keyword>`);

      //        const re = new RegExp(symbol, 'gi');
      //        const match = template.match(re);

      //        // If there's no match, just return the original value.
      //        if (!match) {
      //            return;
      //        }

      //        template = template.replace(re, `<tagged-keyword kw="${symbol}"></tagged-keyword>`)
      //    })
      //})


      //this.entities
      //    .filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1)
      //    .map(entity => {
      //        const symbol = entity["@surfaceForm"];
      //        const re = new RegExp(symbol, 'gi');
      //        const match = template.match(re);

      //        // If there's no match, just return the original value.
      //        if (!match) {
      //            return;
      //        }

      //        template = template.replace(re, `<tagged-keyword kw="${symbol}"></tagged-keyword>`)
      //    })
      var filteredEntities = [];
      if (this.entities.length > 0) {

          filteredEntities = this.entities.filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1);

          var multiquery = filteredEntities
            .reduce((prev, entity, i) => { prev += i > 0 ? "|" + entity["@surfaceForm"] : entity["@surfaceForm"]; return prev; }, "");

          var dict = {};
          filteredEntities.map(d => dict[d["@surfaceForm"]] = d);

        //const symbol = entity["@surfaceForm"];
        const re = new RegExp(multiquery, 'gi');
        const match = template.match(re);

        template = template.replace(re, co => `<tagged-keyword kw="${co}" [entity]="entities['${co}']"></tagged-keyword>`)
      }
      
      var filteredEntitiesDict = {};
      filteredEntities.map(d => filteredEntitiesDict[d["@surfaceForm"]] = d);

    // Now we create a new component. It has that template, and we can even give it data.
    const tmpCmp = Component({ template, styles })(class {
      // the class is anonymous. But it's a quite regular angular class. You could add @Inputs,
      // @Outputs, inject stuff etc.
        entities: any = filteredEntitiesDict;
        data: { };
      ngOnInit() { /* do stuff here in the dynamic component */}
    });

    // Now, also create a dynamic module.
    const tmpModule = NgModule({
        imports: [IonicPageModule.forChild(tmpCmp), TaggedHtmlModule],
        entryComponents: [],
        declarations: [tmpCmp],
      // providers: [] - e.g. if your dynamic component needs any service, provide it here.
    })(class {});

    // Now compile this module and component, and inject it into that #vc in your current component template.
    this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
        .then((factories) => {
            const factoryIdx = factories.componentFactories.length - 1;
            const f = factories.componentFactories[factoryIdx];
            this.cmpRef = f.create(this.injector, [], null, this.moduleRef);
            this.cmpRef.instance.name = 'tagged-html-inst';
            this.vc.insert(this.cmpRef.hostView);
      });
  }

  // Cleanup properly. You can add more cleanup-related stuff here.
  ngOnDestroy() {
      this.destroyComponent();
  }

  destroyComponent() {
      this.vc.clear();
      if (this.cmpRef) {
          //var idx = this.vc.indexOf(this.cmpRef.hostView);
          //this.vc.remove(idx);
          //debugger;
          this.cmpRef.destroy();
      }
  }
}

@Component({
    selector: 'tagged-keyword',
    template: `<span class="keyword" (click)="alert(kw)">{{kw}}</span>`
})
export class TaggedKeyword {
    @Input() kw: string;
    @Input() entity: any;

    constructor(private alertCtrl: AlertController) {

    }

    alert(msg) {
        console.log(this.entity);

        const alert = this.alertCtrl.create({
            title: this.kw,
            subTitle: this.entity["@URI"],
            buttons: ['OK']
        });
        alert.present();
    }
}