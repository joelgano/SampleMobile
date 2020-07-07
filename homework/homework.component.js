"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var angular_1 = require("nativescript-ui-listview/angular");
var view_1 = require("tns-core-modules/ui/core/view");
var homework_model_1 = require("../model/homework.model");
var homework_service_1 = require("../service/homework.service");
var HomeworkComponent = /** @class */ (function () {
    function HomeworkComponent(router, homeworkService) {
        this.router = router;
        this.homeworkService = homeworkService;
        this.subscriptions = [];
        this.tabViewSelectedIndex = 0;
        this.swipeText = 'Complete';
        this.homeworks = [];
        this.homeworks_todo = [];
        this.homeworks_done = [];
        this.scrollOffset_all = 0;
        this.scrollOffset_todo = 0;
        this.scrollOffset_done = 0;
        this.isLoading = true;
        this.warningIconCode = String.fromCharCode(0xea08);
    }
    HomeworkComponent.prototype.ngOnInit = function () {
        this.getHomeworks();
    };
    HomeworkComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptions) {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        }
    };
    HomeworkComponent.prototype.getHomeworks = function () {
        var _this = this;
        this.subscriptions.push(this.homeworkService.getHomeworks()
            .subscribe(function (x) {
            _this.homeworks = x.filter(function (all) { return all.status !== homework_model_1.HomeworkStatus.removed; });
            _this.homeworks_todo = _this.homeworks.filter(function (all) { return all.status === homework_model_1.HomeworkStatus.todo; });
            _this.homeworks_done = _this.homeworks.filter(function (all) { return all.status === homework_model_1.HomeworkStatus.done; });
            _this.sortHomeworkList();
        }, function (error) { return console.log("Error: ", error); }, function () {
            _this.isLoading = false;
        }));
    };
    HomeworkComponent.prototype.getHomeworkDeadlineStatus = function (homework) {
        return this.homeworkService.getHomeworkDeadlineStatus(homework);
    };
    HomeworkComponent.prototype.onScrollEnded_all = function (args) {
        this.scrollOffset_all = args.scrollOffset;
    };
    HomeworkComponent.prototype.onScrollEnded_todo = function (args) {
        this.scrollOffset_todo = args.scrollOffset;
    };
    HomeworkComponent.prototype.onScrollEnded_done = function (args) {
        this.scrollOffset_done = args.scrollOffset;
    };
    HomeworkComponent.prototype.sortHomeworkList = function () {
        var _this = this;
        this.homeworks = this.homeworks.sort(this.sortHomeworkByDueDate);
        this.homeworks_todo = this.homeworks_todo.sort(this.sortHomeworkByDueDate);
        this.homeworks_done = this.homeworks_done.sort(this.sortHomeworkByDueDate);
        if (view_1.isIOS) {
            // required on iOS to redraw the ListView
            this.listViewComponent_all.nativeElement.refresh();
            this.listViewComponent_todo.nativeElement.refresh();
            this.listViewComponent_done.nativeElement.refresh();
        }
        setTimeout(function () {
            _this.listViewComponent_all.listView.scrollWithAmount(_this.scrollOffset_all, false);
            _this.listViewComponent_todo.listView.scrollWithAmount(_this.scrollOffset_todo, false);
            _this.listViewComponent_done.listView.scrollWithAmount(_this.scrollOffset_done, false);
        }, 10);
    };
    HomeworkComponent.prototype.sortHomeworkByDueDate = function (a, b) {
        if (a.dueDate < b.dueDate)
            return -1;
        if (a.dueDate > b.dueDate)
            return 1;
        return 0;
    };
    HomeworkComponent.prototype.markComplete = function (args) {
        var _this = this;
        var item = args.object.bindingContext;
        item.status = homework_model_1.HomeworkStatus.done;
        this.subscriptions.push(this.homeworkService.updateUserHomework(item)
            .subscribe(function () { }, function () { }, function () {
            _this.homeworks_todo.splice(_this.homeworks_todo.indexOf(item), 1);
            _this.homeworks_done.push(item);
            _this.sortHomeworkList();
        }));
        this.listViewComponent_todo.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_done.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_all.listView.notifySwipeToExecuteFinished();
    };
    HomeworkComponent.prototype.markTodo = function (args) {
        var _this = this;
        var item = args.object.bindingContext;
        item.status = homework_model_1.HomeworkStatus.todo;
        this.subscriptions.push(this.homeworkService.updateUserHomework(item)
            .subscribe(function () { }, function () { }, function () {
            _this.homeworks_done.splice(_this.homeworks_done.indexOf(item), 1);
            _this.homeworks_todo.push(item);
            _this.sortHomeworkList();
        }));
        this.listViewComponent_todo.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_done.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_all.listView.notifySwipeToExecuteFinished();
    };
    HomeworkComponent.prototype.onTabViewClicked = function (args) {
        this.tabViewSelectedIndex = args;
    };
    HomeworkComponent.prototype.onItemTap_todo = function (args) {
        this.onItemTap(args, homework_model_1.HomeworkStatus.todo);
    };
    HomeworkComponent.prototype.onItemTap_done = function (args) {
        this.onItemTap(args, homework_model_1.HomeworkStatus.done);
    };
    HomeworkComponent.prototype.onItemTap_all = function (args) {
        this.onItemTap(args, "ALL");
    };
    HomeworkComponent.prototype.onItemTap = function (args, tabText) {
        var homework = new homework_model_1.Homework();
        if (tabText === homework_model_1.HomeworkStatus.todo) {
            homework = this.homeworks_todo[args.index];
        }
        else if (tabText === homework_model_1.HomeworkStatus.done) {
            homework = this.homeworks_done[args.index];
        }
        else {
            homework = this.homeworks[args.index];
        }
        this.router.navigate(["/homeworkdetails/" + homework.id]);
    };
    HomeworkComponent.prototype.onItemSwiping = function (args) {
    };
    HomeworkComponent.prototype.onItemSwiping_all = function (args) {
        var item = this.homeworks[args.index];
        if (item.status === homework_model_1.HomeworkStatus.todo) {
            this.swipeText = 'Complete';
        }
        else {
            this.swipeText = 'To Do';
        }
    };
    HomeworkComponent.prototype.onSwipeCellFinished = function (args) {
    };
    HomeworkComponent.prototype.onSwipeCellStarted = function (args) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['object'];
        var leftItem = swipeView.getViewById('attach-view');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
        var rightItem = swipeView.getViewById('complete-view');
        swipeLimits.right = rightItem.getMeasuredWidth();
    };
    HomeworkComponent.prototype.onCellSwiping = function (args) {
        // const swipeLimits = args.data.swipeLimits;
        // const currentItemView = args.object;
        // if (args.data.x > 200) {
        //     console.log("Notify perform left action");
        // } else if (args.data.x < -200) {
        //     console.log("Notify perform right action");
        // }
    };
    HomeworkComponent.prototype.onLeftSwipeClick = function (args) {
        this.listViewComponent_todo.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_done.listView.notifySwipeToExecuteFinished();
        this.listViewComponent_all.listView.notifySwipeToExecuteFinished();
    };
    __decorate([
        core_1.ViewChild("listView_todo"),
        __metadata("design:type", angular_1.RadListViewComponent)
    ], HomeworkComponent.prototype, "listViewComponent_todo", void 0);
    __decorate([
        core_1.ViewChild("listView_done"),
        __metadata("design:type", angular_1.RadListViewComponent)
    ], HomeworkComponent.prototype, "listViewComponent_done", void 0);
    __decorate([
        core_1.ViewChild("listView_all"),
        __metadata("design:type", angular_1.RadListViewComponent)
    ], HomeworkComponent.prototype, "listViewComponent_all", void 0);
    HomeworkComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'homework',
            templateUrl: './homework.component.html',
            styleUrls: ['./homework.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            homework_service_1.HomeworkService])
    ], HomeworkComponent);
    return HomeworkComponent;
}());
exports.HomeworkComponent = HomeworkComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZXdvcmsuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZXdvcmsuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXdFO0FBQ3hFLDBDQUF5QztBQUl6Qyw0REFBd0U7QUFFeEUsc0RBQTREO0FBRTVELDBEQUEyRjtBQUMzRixnRUFBOEQ7QUFTOUQ7SUFxQkMsMkJBQW9CLE1BQWMsRUFDekIsZUFBZ0M7UUFEckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN6QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFyQmpDLGtCQUFhLEdBQW9CLEVBQUUsQ0FBQztRQUNyQyx5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFDekIsY0FBUyxHQUFHLFVBQVUsQ0FBQztRQUU5QixjQUFTLEdBQWUsRUFBRSxDQUFDO1FBQzNCLG1CQUFjLEdBQWUsRUFBRSxDQUFDO1FBQ2hDLG1CQUFjLEdBQWUsRUFBRSxDQUFDO1FBRWhDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFDOUIsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBRTlCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFNakIsb0JBQWUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR0QsQ0FBQztJQUU5QyxvQ0FBUSxHQUFSO1FBQ0MsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsQ0FBcUIsVUFBa0IsRUFBbEIsS0FBQSxJQUFJLENBQUMsYUFBYSxFQUFsQixjQUFrQixFQUFsQixJQUFrQjtnQkFBdEMsSUFBSSxZQUFZLFNBQUE7Z0JBRWpCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUM5QjtRQUNMLENBQUM7SUFDUixD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Q0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUNwRSxDQUFDO0lBMU0yQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBeUIsOEJBQW9CO3FFQUFDO0lBQzdDO1FBQTNCLGdCQUFTLENBQUMsZUFBZSxDQUFDO2tDQUF5Qiw4QkFBb0I7cUVBQUM7SUFDOUM7UUFBMUIsZ0JBQVMsQ0FBQyxjQUFjLENBQUM7a0NBQXdCLDhCQUFvQjtvRUFBQztJQWpCM0QsaUJBQWlCO1FBUDdCLGdCQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUN4QyxDQUFDO3lDQXVCMkIsZUFBTTtZQUNSLGtDQUFlO09BdEI3QixpQkFBaUIsQ0EwTjdCO0lBQUQsd0JBQUM7Q0FBQSxBQTFORCxJQTBOQztBQTFOWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5cclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IExpc3RWaWV3RXZlbnREYXRhLCBMaXN0Vmlld1Njcm9sbEV2ZW50RGF0YSwgU3dpcGVBY3Rpb25zRXZlbnREYXRhIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC11aS1saXN0dmlld1wiO1xyXG5pbXBvcnQgeyBSYWRMaXN0Vmlld0NvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdWktbGlzdHZpZXcvYW5ndWxhclwiO1xyXG5cclxuaW1wb3J0IHsgVmlldywgaXNJT1MgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvdmlldyc7XHJcblxyXG5pbXBvcnQgeyBIb21ld29yaywgSG9tZXdvcmtEZWFkbGluZVN0YXR1cywgSG9tZXdvcmtTdGF0dXMgfSBmcm9tICcuLi9tb2RlbC9ob21ld29yay5tb2RlbCc7XHJcbmltcG9ydCB7IEhvbWV3b3JrU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2UvaG9tZXdvcmsuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG5cdHNlbGVjdG9yOiAnaG9tZXdvcmsnLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9ob21ld29yay5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vaG9tZXdvcmsuY29tcG9uZW50Lmxlc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEhvbWV3b3JrQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cdHByaXZhdGUgc3Vic2NyaXB0aW9ucyA6IFN1YnNjcmlwdGlvbltdID0gW107XHJcblx0cHVibGljIHRhYlZpZXdTZWxlY3RlZEluZGV4ID0gMDtcclxuXHRwdWJsaWMgc3dpcGVUZXh0ID0gJ0NvbXBsZXRlJztcclxuXHJcblx0aG9tZXdvcmtzOiBIb21ld29ya1tdID0gW107XHJcblx0aG9tZXdvcmtzX3RvZG86IEhvbWV3b3JrW10gPSBbXTtcclxuXHRob21ld29ya3NfZG9uZTogSG9tZXdvcmtbXSA9IFtdO1xyXG5cclxuXHRzY3JvbGxPZmZzZXRfYWxsOiBudW1iZXIgPSAwO1xyXG5cdHNjcm9sbE9mZnNldF90b2RvOiBudW1iZXIgPSAwO1xyXG5cdHNjcm9sbE9mZnNldF9kb25lOiBudW1iZXIgPSAwO1xyXG5cclxuXHRpc0xvYWRpbmcgPSB0cnVlO1xyXG5cclxuXHRAVmlld0NoaWxkKFwibGlzdFZpZXdfdG9kb1wiKSBsaXN0Vmlld0NvbXBvbmVudF90b2RvOiBSYWRMaXN0Vmlld0NvbXBvbmVudDtcclxuXHRAVmlld0NoaWxkKFwibGlzdFZpZXdfZG9uZVwiKSBsaXN0Vmlld0NvbXBvbmVudF9kb25lOiBSYWRMaXN0Vmlld0NvbXBvbmVudDtcclxuXHRAVmlld0NoaWxkKFwibGlzdFZpZXdfYWxsXCIpIGxpc3RWaWV3Q29tcG9uZW50X2FsbDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XHJcblx0XHJcblx0d2FybmluZ0ljb25Db2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGVhMDgpO1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcblx0XHRwcml2YXRlIGhvbWV3b3JrU2VydmljZTogSG9tZXdvcmtTZXJ2aWNlKSB7IH1cclxuXHJcblx0bmdPbkluaXQoKSB7IFxyXG5cdFx0dGhpcy5nZXRIb21ld29ya3MoKTtcclxuXHR9XHJcblxyXG5cdG5nT25EZXN0cm95KCkge1xyXG5cdFx0aWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzdWJzY3JpcHRpb24gb2YgdGhpcy5zdWJzY3JpcHRpb25zKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdGdldEhvbWV3b3JrcygpIHtcclxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG5cdFx0XHR0aGlzLmhvbWV3b3JrU2VydmljZS5nZXRIb21ld29ya3MoKVxyXG5cdFx0XHQuc3Vic2NyaWJlKFxyXG5cdFx0XHRcdHggPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5ob21ld29ya3MgPSB4LmZpbHRlcihhbGwgPT4gYWxsLnN0YXR1cyAhPT0gSG9tZXdvcmtTdGF0dXMucmVtb3ZlZCk7XHJcblx0XHRcdFx0XHR0aGlzLmhvbWV3b3Jrc190b2RvID0gdGhpcy5ob21ld29ya3MuZmlsdGVyKGFsbCA9PiBhbGwuc3RhdHVzID09PSBIb21ld29ya1N0YXR1cy50b2RvKTtcclxuXHRcdFx0XHRcdHRoaXMuaG9tZXdvcmtzX2RvbmUgPSB0aGlzLmhvbWV3b3Jrcy5maWx0ZXIoYWxsID0+IGFsbC5zdGF0dXMgPT09IEhvbWV3b3JrU3RhdHVzLmRvbmUpO1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0SG9tZXdvcmtMaXN0KCk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRlcnJvciA9PiBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiwgZXJyb3IpLFxyXG5cdFx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxuXHRcclxuXHRnZXRIb21ld29ya0RlYWRsaW5lU3RhdHVzKGhvbWV3b3JrOiBIb21ld29yayk6IEhvbWV3b3JrRGVhZGxpbmVTdGF0dXMge1xyXG5cdFx0cmV0dXJuIHRoaXMuaG9tZXdvcmtTZXJ2aWNlLmdldEhvbWV3b3JrRGVhZGxpbmVTdGF0dXMoaG9tZXdvcmspO1xyXG5cdH1cclxuXHJcblx0b25TY3JvbGxFbmRlZF9hbGwoYXJnczogTGlzdFZpZXdTY3JvbGxFdmVudERhdGEpIHtcclxuXHRcdHRoaXMuc2Nyb2xsT2Zmc2V0X2FsbCA9IGFyZ3Muc2Nyb2xsT2Zmc2V0O1xyXG5cdH1cclxuXHJcblx0b25TY3JvbGxFbmRlZF90b2RvKGFyZ3M6IExpc3RWaWV3U2Nyb2xsRXZlbnREYXRhKSB7XHJcblx0XHR0aGlzLnNjcm9sbE9mZnNldF90b2RvID0gYXJncy5zY3JvbGxPZmZzZXQ7XHJcblx0fVxyXG5cclxuXHRvblNjcm9sbEVuZGVkX2RvbmUoYXJnczogTGlzdFZpZXdTY3JvbGxFdmVudERhdGEpIHtcclxuXHRcdHRoaXMuc2Nyb2xsT2Zmc2V0X2RvbmUgPSBhcmdzLnNjcm9sbE9mZnNldDtcclxuXHR9XHJcblxyXG5cdHNvcnRIb21ld29ya0xpc3QoKSB7XHJcblx0XHR0aGlzLmhvbWV3b3JrcyA9IHRoaXMuaG9tZXdvcmtzLnNvcnQodGhpcy5zb3J0SG9tZXdvcmtCeUR1ZURhdGUpO1xyXG5cdFx0dGhpcy5ob21ld29ya3NfdG9kbyA9IHRoaXMuaG9tZXdvcmtzX3RvZG8uc29ydCh0aGlzLnNvcnRIb21ld29ya0J5RHVlRGF0ZSk7XHJcblx0XHR0aGlzLmhvbWV3b3Jrc19kb25lID0gdGhpcy5ob21ld29ya3NfZG9uZS5zb3J0KHRoaXMuc29ydEhvbWV3b3JrQnlEdWVEYXRlKTtcclxuXHJcblx0XHRpZiAoaXNJT1MpIHtcclxuXHRcdFx0Ly8gcmVxdWlyZWQgb24gaU9TIHRvIHJlZHJhdyB0aGUgTGlzdFZpZXdcclxuXHRcdFx0dGhpcy5saXN0Vmlld0NvbXBvbmVudF9hbGwubmF0aXZlRWxlbWVudC5yZWZyZXNoKCk7XHJcblx0XHRcdHRoaXMubGlzdFZpZXdDb21wb25lbnRfdG9kby5uYXRpdmVFbGVtZW50LnJlZnJlc2goKTtcclxuXHRcdFx0dGhpcy5saXN0Vmlld0NvbXBvbmVudF9kb25lLm5hdGl2ZUVsZW1lbnQucmVmcmVzaCgpO1xyXG5cdFx0fVxyXG5cdFx0ICBcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmxpc3RWaWV3Q29tcG9uZW50X2FsbC5saXN0Vmlldy5zY3JvbGxXaXRoQW1vdW50KHRoaXMuc2Nyb2xsT2Zmc2V0X2FsbCwgZmFsc2UpO1xyXG5cdFx0XHR0aGlzLmxpc3RWaWV3Q29tcG9uZW50X3RvZG8ubGlzdFZpZXcuc2Nyb2xsV2l0aEFtb3VudCh0aGlzLnNjcm9sbE9mZnNldF90b2RvLCBmYWxzZSk7XHJcblx0XHRcdHRoaXMubGlzdFZpZXdDb21wb25lbnRfZG9uZS5saXN0Vmlldy5zY3JvbGxXaXRoQW1vdW50KHRoaXMuc2Nyb2xsT2Zmc2V0X2RvbmUsIGZhbHNlKTtcclxuXHRcdH0sIDEwKTtcclxuXHR9XHJcblxyXG5cdHNvcnRIb21ld29ya0J5RHVlRGF0ZShhLCBiKSB7XHJcblx0XHRpZiAoYS5kdWVEYXRlIDwgYi5kdWVEYXRlKVxyXG5cdFx0ICByZXR1cm4gLTE7XHJcblx0XHRpZiAoYS5kdWVEYXRlID4gYi5kdWVEYXRlKVxyXG5cdFx0ICByZXR1cm4gMTtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxuXHJcblx0bWFya0NvbXBsZXRlKGFyZ3MpIHtcclxuXHRcdGxldCBpdGVtID0gYXJncy5vYmplY3QuYmluZGluZ0NvbnRleHQgYXMgSG9tZXdvcms7XHJcblx0XHRpdGVtLnN0YXR1cyA9IEhvbWV3b3JrU3RhdHVzLmRvbmU7XHJcblx0XHRcclxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG5cdFx0XHR0aGlzLmhvbWV3b3JrU2VydmljZS51cGRhdGVVc2VySG9tZXdvcmsoaXRlbSlcclxuXHRcdFx0LnN1YnNjcmliZShcclxuXHRcdFx0XHQoKSA9PiB7IH0sXHJcblx0XHRcdFx0KCkgPT4geyB9LFxyXG5cdFx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuaG9tZXdvcmtzX3RvZG8uc3BsaWNlKHRoaXMuaG9tZXdvcmtzX3RvZG8uaW5kZXhPZihpdGVtKSwgMSk7XHJcblx0XHRcdFx0XHR0aGlzLmhvbWV3b3Jrc19kb25lLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHR0aGlzLnNvcnRIb21ld29ya0xpc3QoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5saXN0Vmlld0NvbXBvbmVudF90b2RvLmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcclxuXHRcdHRoaXMubGlzdFZpZXdDb21wb25lbnRfZG9uZS5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcblx0XHR0aGlzLmxpc3RWaWV3Q29tcG9uZW50X2FsbC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcblx0fVxyXG5cclxuXHRtYXJrVG9kbyhhcmdzKSB7XHJcblx0XHRsZXQgaXRlbSA9IGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0IGFzIEhvbWV3b3JrO1xyXG5cdFx0aXRlbS5zdGF0dXMgPSBIb21ld29ya1N0YXR1cy50b2RvO1xyXG5cdFx0XHJcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuXHRcdFx0dGhpcy5ob21ld29ya1NlcnZpY2UudXBkYXRlVXNlckhvbWV3b3JrKGl0ZW0pXHJcblx0XHRcdC5zdWJzY3JpYmUoXHJcblx0XHRcdFx0KCkgPT4geyB9LFxyXG5cdFx0XHRcdCgpID0+IHsgfSxcclxuXHRcdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmhvbWV3b3Jrc19kb25lLnNwbGljZSh0aGlzLmhvbWV3b3Jrc19kb25lLmluZGV4T2YoaXRlbSksIDEpO1xyXG5cdFx0XHRcdFx0dGhpcy5ob21ld29ya3NfdG9kby5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zb3J0SG9tZXdvcmtMaXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMubGlzdFZpZXdDb21wb25lbnRfdG9kby5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcblx0XHR0aGlzLmxpc3RWaWV3Q29tcG9uZW50X2RvbmUubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG5cdFx0dGhpcy5saXN0Vmlld0NvbXBvbmVudF9hbGwubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG5cdH1cclxuXHJcblx0b25UYWJWaWV3Q2xpY2tlZChhcmdzKSB7IFxyXG5cdFx0dGhpcy50YWJWaWV3U2VsZWN0ZWRJbmRleCA9IGFyZ3M7XHJcblx0fVxyXG5cclxuXHRvbkl0ZW1UYXBfdG9kbyhhcmdzKSB7XHJcblx0XHR0aGlzLm9uSXRlbVRhcChhcmdzLCBIb21ld29ya1N0YXR1cy50b2RvKTtcclxuXHR9XHJcblxyXG5cdG9uSXRlbVRhcF9kb25lKGFyZ3MpIHtcclxuXHRcdHRoaXMub25JdGVtVGFwKGFyZ3MsIEhvbWV3b3JrU3RhdHVzLmRvbmUpO1xyXG5cdH1cclxuXHJcblx0b25JdGVtVGFwX2FsbChhcmdzKSB7XHJcblx0XHR0aGlzLm9uSXRlbVRhcChhcmdzLCBcIkFMTFwiKTtcclxuXHR9XHJcblxyXG5cdG9uSXRlbVRhcChhcmdzLCB0YWJUZXh0KSB7XHJcblx0XHRsZXQgaG9tZXdvcmsgPSBuZXcgSG9tZXdvcmsoKTtcclxuXHRcdGlmKHRhYlRleHQgPT09IEhvbWV3b3JrU3RhdHVzLnRvZG8pIHtcclxuXHRcdFx0aG9tZXdvcmsgPSB0aGlzLmhvbWV3b3Jrc190b2RvW2FyZ3MuaW5kZXhdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih0YWJUZXh0ID09PSBIb21ld29ya1N0YXR1cy5kb25lKSB7XHJcblx0XHRcdGhvbWV3b3JrID0gdGhpcy5ob21ld29ya3NfZG9uZVthcmdzLmluZGV4XTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRob21ld29yayA9IHRoaXMuaG9tZXdvcmtzW2FyZ3MuaW5kZXhdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW2AvaG9tZXdvcmtkZXRhaWxzLyR7aG9tZXdvcmsuaWR9YF0pO1xyXG5cdH1cclxuXHRcclxuXHRvbkl0ZW1Td2lwaW5nKGFyZ3MpIHtcclxuXHJcblx0fVxyXG5cclxuXHRvbkl0ZW1Td2lwaW5nX2FsbChhcmdzKSB7XHJcblx0XHRsZXQgaXRlbSA9IHRoaXMuaG9tZXdvcmtzW2FyZ3MuaW5kZXhdO1xyXG5cdFx0aWYoaXRlbS5zdGF0dXMgPT09IEhvbWV3b3JrU3RhdHVzLnRvZG8pIHtcclxuXHRcdFx0dGhpcy5zd2lwZVRleHQgPSAnQ29tcGxldGUnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuc3dpcGVUZXh0ID0gJ1RvIERvJztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0b25Td2lwZUNlbGxGaW5pc2hlZChhcmdzKSB7XHJcblxyXG5cdH1cclxuXHJcblx0b25Td2lwZUNlbGxTdGFydGVkKGFyZ3M6IFN3aXBlQWN0aW9uc0V2ZW50RGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHN3aXBlTGltaXRzID0gYXJncy5kYXRhLnN3aXBlTGltaXRzO1xyXG5cdFx0Y29uc3Qgc3dpcGVWaWV3ID0gYXJnc1snb2JqZWN0J107XHJcblx0XHRcclxuICAgICAgICBjb25zdCBsZWZ0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZDxWaWV3PignYXR0YWNoLXZpZXcnKTtcclxuICAgICAgICBzd2lwZUxpbWl0cy5sZWZ0ID0gbGVmdEl0ZW0uZ2V0TWVhc3VyZWRXaWR0aCgpO1xyXG5cdFx0c3dpcGVMaW1pdHMudGhyZXNob2xkID0gbGVmdEl0ZW0uZ2V0TWVhc3VyZWRXaWR0aCgpIC8gMjtcclxuXHRcdFxyXG4gICAgICAgIGNvbnN0IHJpZ2h0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZDxWaWV3PignY29tcGxldGUtdmlldycpO1xyXG4gICAgICAgIHN3aXBlTGltaXRzLnJpZ2h0ID0gcmlnaHRJdGVtLmdldE1lYXN1cmVkV2lkdGgoKTtcclxuXHR9XHJcblxyXG5cdG9uQ2VsbFN3aXBpbmcoYXJnczogU3dpcGVBY3Rpb25zRXZlbnREYXRhKSB7XHJcbiAgICAgICAgLy8gY29uc3Qgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XHJcbiAgICAgICAgLy8gY29uc3QgY3VycmVudEl0ZW1WaWV3ID0gYXJncy5vYmplY3Q7XHJcblxyXG4gICAgICAgIC8vIGlmIChhcmdzLmRhdGEueCA+IDIwMCkge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIk5vdGlmeSBwZXJmb3JtIGxlZnQgYWN0aW9uXCIpO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAoYXJncy5kYXRhLnggPCAtMjAwKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiTm90aWZ5IHBlcmZvcm0gcmlnaHQgYWN0aW9uXCIpO1xyXG4gICAgICAgIC8vIH1cclxuXHR9XHJcblxyXG5cdG9uTGVmdFN3aXBlQ2xpY2soYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuXHRcdHRoaXMubGlzdFZpZXdDb21wb25lbnRfdG9kby5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcblx0XHR0aGlzLmxpc3RWaWV3Q29tcG9uZW50X2RvbmUubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG5cdFx0dGhpcy5saXN0Vmlld0NvbXBvbmVudF9hbGwubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG5cdH1cclxufSJdfQ==