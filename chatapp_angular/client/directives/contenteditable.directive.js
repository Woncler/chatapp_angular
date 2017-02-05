// http://stackoverflow.com/a/41253897
// Angular 2 really doesn't like ContentEditable divs, - yet...
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ContenteditableModel = (function () {
    function ContenteditableModel(elRef) {
        this.elRef = elRef;
        this.update = new core_1.EventEmitter();
    }
    ContenteditableModel.prototype.ngOnChanges = function (changes) {
        if (changes['model'] && changes['model'].currentValue !== this.lastViewModel) {
            this.lastViewModel = this.model;
            this.refreshView();
        }
    };
    /** This should probably be debounced. */
    ContenteditableModel.prototype.onKeyup = function () {
        var value = this.elRef.nativeElement.innerText;
        this.lastViewModel = value;
        this.update.emit(value);
    };
    ContenteditableModel.prototype.refreshView = function () {
        this.elRef.nativeElement.innerText = this.model;
    };
    return ContenteditableModel;
}());
__decorate([
    core_1.Input('contenteditableModel'),
    __metadata("design:type", String)
], ContenteditableModel.prototype, "model", void 0);
__decorate([
    core_1.Output('contenteditableModelChange'),
    __metadata("design:type", Object)
], ContenteditableModel.prototype, "update", void 0);
ContenteditableModel = __decorate([
    core_1.Directive({
        selector: '[contenteditableModel]',
        host: {
            '(keyup)': 'onKeyup()'
        }
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], ContenteditableModel);
exports.ContenteditableModel = ContenteditableModel;
//# sourceMappingURL=contenteditable.directive.js.map