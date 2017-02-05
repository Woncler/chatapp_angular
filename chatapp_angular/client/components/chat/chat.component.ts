import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat/chat.service';
import { UserService } from '../../services/user/user.service';
import { SocketService } from '../../services/socket/socket.service';
import { User } from '../../types/user.type';
import { Room } from '../../types/room.type';
import { Message } from '../../types/message.type';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'chat',
    templateUrl: 'chat.component.html'
})

export class ChatComponent implements OnInit {
    messages: {sender: string, time: Date, messages: string[]}[];
    room: Room;
    user: User;
    socket: any;
    newmessage: Message;
    emojisHidden: boolean = true;
    emojimenuToggle: string = 'glyphicon-thumbs-up';
    tabs: { heading: string, content: string[] }[];
    @ViewChild('m') m: ElementRef;
    @ViewChild('scrollMessages') scrollMessages: ElementRef;

    constructor(private chatService: ChatService, private userService: UserService, private socketService: SocketService, private route: ActivatedRoute) { }

    ngOnInit() {
        console.log('initting chatroom');
        this.socket = this.socketService.socket;
        this.user = this.route.snapshot.data['user'];
        this.route.data.subscribe(data => {
            this.messages = [];
            this.room = data['room'];
            this.socketService.joinRoom(this.room.id);
            this.newmessage = { room: this.room.id, message: '', sender: this.user.username, timestamp: null };
        });

        let emojiArray = [{ 0: { start: 0x1F601, end: 0x1F64F }, 1: { start: 0x1F440, end: 0x1F487 }, 2: { start: 0x1F4A9, end: 0x1F4AA } }, { 0: { start: 0x1F40C, end: 0x1F43E } }, { 0: { start: 0x1F4AB, end: 0x1F517 } }, { 0: { start: 0x1F330, end: 0x1F37B}}];
        this.tabs = [];
        emojiArray.forEach((emojiTab, i) => {
            this.tabs.push({heading: '', content: []});
            this.tabs[i].heading = String.fromCodePoint(emojiTab[0].start);
            for (let emojiGroup in emojiTab) {
                for (var _i = emojiTab[emojiGroup].start; _i < emojiTab[emojiGroup].end + 1; _i++) {
                    this.tabs[i].content.push(String.fromCodePoint(_i));
                }
            }
        });

        console.log(this.socket);       
        
        this.socket.on('chat message', (message: Message) => {
            this.addMsg(message);
        })
    }

    sndMsg() {
        this.newmessage.message = this.m.nativeElement.textContent.trim();
        let time = new Date();

        if (this.newmessage.message != '') {
            this.newmessage.timestamp = time;
            this.socketService.sendMessage(this.newmessage);
            this.addMsg(this.newmessage);
            console.log(this.newmessage);
        } else {
            console.log('msg was empty');
        }
        
        this.newmessage.message = '';
        this.m.nativeElement.textContent = '';
        this.emojisHidden = true;
        this.emojimenuToggle = 'glyphicon-thumbs-up';
    }

    addMsg(message: Message) {
        if (this.messages.length > 0) {
            let lastMessage = this.messages[this.messages.length - 1];
            let timeStamp = new Date(lastMessage.time);
            let timeTester = new Date();
            timeTester.setTime(timeTester.getTime() - 300000);

            if (lastMessage.sender == message.sender && timeTester < timeStamp) {
                lastMessage.messages.push(message.message);
            } else {
                this.messages.push({ sender: message.sender, time: message.timestamp, messages: [message.message] });
            }
        } else {
            this.messages.push({ sender: message.sender, time: message.timestamp, messages: [message.message] });
        }

        this.scrollMessages.nativeElement.scrollTop = this.scrollMessages.nativeElement.scrollHeight;
    }

    enterPress(event: any) {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();
            this.sndMsg();
        }
    }

    pasteEmoji(emoji: string) {
        this.m.nativeElement.focus();
        this.pasteHtmlAtCaret(emoji);
    }

    // https://jsfiddle.net/Xeoncross/4tUDk/
    // Pasting emojis to 
    pasteHtmlAtCaret(html: string) {
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
        }/* else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }*/
    }
}