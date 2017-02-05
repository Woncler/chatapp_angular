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
var router_1 = require("@angular/router");
var chat_service_1 = require("../../services/chat/chat.service");
var user_service_1 = require("../../services/user/user.service");
var socket_service_1 = require("../../services/socket/socket.service");
var ChatComponent = (function () {
    function ChatComponent(chatService, userService, socketService, route) {
        this.chatService = chatService;
        this.userService = userService;
        this.socketService = socketService;
        this.route = route;
        this.emojisHidden = true;
        this.emojimenuToggle = 'glyphicon-thumbs-up';
    }
    ChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('initting chatroom');
        this.socket = this.socketService.socket;
        this.user = this.route.snapshot.data['user'];
        this.route.data.subscribe(function (data) {
            _this.messages = [];
            _this.room = data['room'];
            _this.socketService.joinRoom(_this.room.id);
            _this.newmessage = { room: _this.room.id, message: '', sender: _this.user.username, timestamp: null };
        });
        var emojiArray = [{ 0: { start: 0x1F601, end: 0x1F64F }, 1: { start: 0x1F440, end: 0x1F487 }, 2: { start: 0x1F4A9, end: 0x1F4AA } }, { 0: { start: 0x1F40C, end: 0x1F43E } }, { 0: { start: 0x1F4AB, end: 0x1F517 } }, { 0: { start: 0x1F330, end: 0x1F37B } }];
        this.tabs = [];
        emojiArray.forEach(function (emojiTab, i) {
            _this.tabs.push({ heading: '', content: [] });
            _this.tabs[i].heading = String.fromCodePoint(emojiTab[0].start);
            for (var emojiGroup in emojiTab) {
                for (var _i = emojiTab[emojiGroup].start; _i < emojiTab[emojiGroup].end + 1; _i++) {
                    _this.tabs[i].content.push(String.fromCodePoint(_i));
                }
            }
        });
        console.log(this.socket);
        this.socket.on('chat message', function (message) {
            _this.addMsg(message);
        });
    };
    ChatComponent.prototype.sndMsg = function () {
        this.newmessage.message = this.m.nativeElement.textContent.trim();
        var time = new Date();
        if (this.newmessage.message != '') {
            this.newmessage.timestamp = time;
            this.socketService.sendMessage(this.newmessage);
            this.addMsg(this.newmessage);
            console.log(this.newmessage);
        }
        else {
            console.log('msg was empty');
        }
        this.newmessage.message = '';
        this.m.nativeElement.textContent = '';
        this.emojisHidden = true;
        this.emojimenuToggle = 'glyphicon-thumbs-up';
    };
    ChatComponent.prototype.addMsg = function (message) {
        if (this.messages.length > 0) {
            var lastMessage = this.messages[this.messages.length - 1];
            var timeStamp = new Date(lastMessage.time);
            var timeTester = new Date();
            timeTester.setTime(timeTester.getTime() - 300000);
            if (lastMessage.sender == message.sender && timeTester < timeStamp) {
                lastMessage.messages.push(message.message);
            }
            else {
                this.messages.push({ sender: message.sender, time: message.timestamp, messages: [message.message] });
            }
        }
        else {
            this.messages.push({ sender: message.sender, time: message.timestamp, messages: [message.message] });
        }
        this.scrollMessages.nativeElement.scrollTop = this.scrollMessages.nativeElement.scrollHeight;
    };
    ChatComponent.prototype.enterPress = function (event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();
            this.sndMsg();
        }
    };
    ChatComponent.prototype.pasteEmoji = function (emoji) {
        this.m.nativeElement.focus();
        this.pasteHtmlAtCaret(emoji);
    };
    // https://jsfiddle.net/Xeoncross/4tUDk/
    // Pasting emojis to 
    ChatComponent.prototype.pasteHtmlAtCaret = function (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } /* else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }*/
    };
    return ChatComponent;
}());
__decorate([
    core_1.ViewChild('m'),
    __metadata("design:type", core_1.ElementRef)
], ChatComponent.prototype, "m", void 0);
__decorate([
    core_1.ViewChild('scrollMessages'),
    __metadata("design:type", core_1.ElementRef)
], ChatComponent.prototype, "scrollMessages", void 0);
ChatComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'chat',
        templateUrl: 'chat.component.html'
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService, user_service_1.UserService, socket_service_1.SocketService, router_1.ActivatedRoute])
], ChatComponent);
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map