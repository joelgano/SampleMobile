"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var user_model_1 = require("../model/user.model");
var appvalues_service_1 = require("../service/appvalues.service");
var login_service_1 = require("../service/login.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(appValuesService, loginService, router) {
        this.appValuesService = appValuesService;
        this.loginService = loginService;
        this.router = router;
        this.isLoginBusy = false;
        this.errorMessage = "";
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.logIn = new user_model_1.User();
        // this.logIn.username = 'parent';
        // this.logIn.password = 'parent';
        // this.logIn.birthdate = '01/01/1950';
        // this.logIn.username = 'student1';
        // this.logIn.password = 'password';
        // this.logIn.birthdate = '02/03/2001';
        // this.logIn.username = '1';
        // this.logIn.password = '1';
        // this.logIn.birthdate = '1';
        // this.logIn.username = 'parent1';
        // this.logIn.password = 'parent';
        // this.logIn.birthdate = '01/02/1950';
        // this.login();
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        if (this.subscription != undefined) {
            this.subscription.unsubscribe();
        }
    };
    LoginComponent.prototype.forgotPassword = function () {
        this.router.navigate(["forgotpassword"]);
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        if (!this.isLoginBusy) {
            this.isLoginBusy = true;
            this.errorMessage = "";
            var isValid = this.validInput(this.logIn);
            if (isValid != false) {
                this.subscription = this.loginService.getUser(this.logIn)
                    .subscribe(function (user) {
                    var isSuccessful = _this.checkUser(user);
                    if (!isSuccessful) {
                        _this.isLoginBusy = false;
                    }
                });
            }
            else {
                this.isLoginBusy = false;
            }
        }
    };
    LoginComponent.prototype.validInput = function (logIn) {
        if ((!logIn.username) || (!logIn.password) || (!logIn.birthdate)) {
            this.errorMessage = "Required fields";
            if (!logIn.username) {
                this.username.nativeElement.borderColor = "red";
            }
            if (!logIn.password) {
                this.password.nativeElement.borderColor = "red";
            }
            if (!logIn.birthdate) {
                this.dob.nativeElement.borderColor = "red";
            }
            return false;
        }
        return true;
    };
    LoginComponent.prototype.checkUser = function (login) {
        var _this = this;
        if ((login === undefined) ||
            (login.username != this.logIn.username) ||
            (login.password != this.logIn.password) ||
            (login.birthdate != this.logIn.birthdate)) {
            this.errorMessage = "User not found";
            return false;
        }
        else {
            this.appValuesService.setLoggedInUser(login);
            if (login.isfirsttime) {
                this.router.navigate(["updatesecuritydetails"]);
            }
            else {
                this.router.navigate(["dashboard"]);
                setTimeout(function () { _this.router.navigate(["advert"]); }, 200);
            }
        }
        return true;
    };
    __decorate([
        core_1.ViewChild("username"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "username", void 0);
    __decorate([
        core_1.ViewChild("password"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "password", void 0);
    __decorate([
        core_1.ViewChild("dob"),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "dob", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.less']
        }),
        __metadata("design:paramtypes", [appvalues_service_1.AppValuesService,
            login_service_1.LoginService,
            router_1.RouterExtensions])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1GO0FBQ25GLHNEQUE4RDtBQUc5RCxrREFBMEM7QUFFMUMsa0VBQWdFO0FBQ2hFLDBEQUF3RDtBQVN4RDtJQVdJLHdCQUNZLGdCQUFrQyxFQUNsQyxZQUEwQixFQUMxQixNQUF3QjtRQUZ4QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBWHBDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRTdCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO0lBVWQsQ0FBQztJQUVMLGlDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQUksRUFBRSxDQUFDO1FBRXhCLGtDQUFrQztRQUNsQyxrQ0FBa0M7UUFDbEMsdUNBQXVDO1FBRXZDLG9DQUFvQztRQUNwQyxvQ0FBb0M7UUFDcEMsdUNBQXVDO1FBRXZDLDZCQUE2QjtRQUM3Qiw2QkFBNkI7UUFDN0IsOEJBQThCO1FBRTlCLG1DQUFtQztRQUNuQyxrQ0FBa0M7UUFDbEMsdUNBQXVDO1FBRXZDLGdCQUFnQjtJQUNwQixDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLENBQUM7SUFDTCxDQUFDO0lBRUQsdUNBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCw4QkFBSyxHQUFMO1FBQUEsaUJBa0JDO1FBakJHLEVBQUUsQ0FBQSxDQUFDLENBQUMs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QUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFVBQVUsQ0FBQyxjQUFPLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQXRHc0I7UUFBdEIsZ0JBQVMsQ0FBQyxVQUFVLENBQUM7a0NBQVcsaUJBQVU7b0RBQUM7SUFDckI7UUFBdEIsZ0JBQVMsQ0FBQyxVQUFVLENBQUM7a0NBQVcsaUJBQVU7b0RBQUM7SUFDMUI7UUFBakIsZ0JBQVMsQ0FBQyxLQUFLLENBQUM7a0NBQU0saUJBQVU7K0NBQUM7SUFUekIsY0FBYztRQVAxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDeEMsQ0FBQzt5Q0FjZ0Msb0NBQWdCO1lBQ3BCLDRCQUFZO1lBQ2xCLHlCQUFnQjtPQWQzQixjQUFjLENBOEcxQjtJQUFELHFCQUFDO0NBQUEsQUE5R0QsSUE4R0M7QUE5R1ksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJ1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vbW9kZWwvdXNlci5tb2RlbFwiXHJcblxyXG5pbXBvcnQgeyBBcHBWYWx1ZXNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZS9hcHB2YWx1ZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2UvbG9naW4uc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLWxvZ2luJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9sb2dpbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9sb2dpbi5jb21wb25lbnQubGVzcyddXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbiA6IFN1YnNjcmlwdGlvbjtcclxuICAgIGxvZ0luOiBVc2VyO1xyXG4gICAgaXNMb2dpbkJ1c3k6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBlcnJvck1lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoXCJ1c2VybmFtZVwiKSB1c2VybmFtZTogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoXCJwYXNzd29yZFwiKSBwYXNzd29yZDogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoXCJkb2JcIikgZG9iOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXBwVmFsdWVzU2VydmljZTogQXBwVmFsdWVzU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmxvZ0luID0gbmV3IFVzZXIoKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi51c2VybmFtZSA9ICdwYXJlbnQnO1xyXG4gICAgICAgIC8vIHRoaXMubG9nSW4ucGFzc3dvcmQgPSAncGFyZW50JztcclxuICAgICAgICAvLyB0aGlzLmxvZ0luLmJpcnRoZGF0ZSA9ICcwMS8wMS8xOTUwJztcclxuXHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi51c2VybmFtZSA9ICdzdHVkZW50MSc7XHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi5wYXNzd29yZCA9ICdwYXNzd29yZCc7XHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi5iaXJ0aGRhdGUgPSAnMDIvMDMvMjAwMSc7XHJcblxyXG4gICAgICAgIC8vIHRoaXMubG9nSW4udXNlcm5hbWUgPSAnMSc7XHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi5wYXNzd29yZCA9ICcxJztcclxuICAgICAgICAvLyB0aGlzLmxvZ0luLmJpcnRoZGF0ZSA9ICcxJztcclxuXHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi51c2VybmFtZSA9ICdwYXJlbnQxJztcclxuICAgICAgICAvLyB0aGlzLmxvZ0luLnBhc3N3b3JkID0gJ3BhcmVudCc7XHJcbiAgICAgICAgLy8gdGhpcy5sb2dJbi5iaXJ0aGRhdGUgPSAnMDEvMDIvMTk1MCc7XHJcblxyXG4gICAgICAgIC8vIHRoaXMubG9naW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvcmdvdFBhc3N3b3JkKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtgZm9yZ290cGFzc3dvcmRgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNMb2dpbkJ1c3kpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvZ2luQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSB0aGlzLnZhbGlkSW5wdXQodGhpcy5sb2dJbik7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWYWxpZCAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmxvZ2luU2VydmljZS5nZXRVc2VyKHRoaXMubG9nSW4pXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSh1c2VyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNTdWNjZXNzZnVsID0gdGhpcy5jaGVja1VzZXIodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1N1Y2Nlc3NmdWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2dpbkJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9naW5CdXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZElucHV0KGxvZ0luKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCghbG9nSW4udXNlcm5hbWUpIHx8ICghbG9nSW4ucGFzc3dvcmQpIHx8ICghbG9nSW4uYmlydGhkYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiUmVxdWlyZWQgZmllbGRzXCI7XHJcbiAgICAgICAgICAgIGlmICghbG9nSW4udXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcm5hbWUubmF0aXZlRWxlbWVudC5ib3JkZXJDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbG9nSW4ucGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFzc3dvcmQubmF0aXZlRWxlbWVudC5ib3JkZXJDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbG9nSW4uYmlydGhkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvYi5uYXRpdmVFbGVtZW50LmJvcmRlckNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja1VzZXIobG9naW46IFVzZXIpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoKGxvZ2luID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChsb2dpbi51c2VybmFtZSAhPSB0aGlzLmxvZ0luLnVzZXJuYW1lKSB8fFxyXG4gICAgICAgICAgICAobG9naW4ucGFzc3dvcmQgIT0gdGhpcy5sb2dJbi5wYXNzd29yZCkgfHxcclxuICAgICAgICAgICAgKGxvZ2luLmJpcnRoZGF0ZSAhPSB0aGlzLmxvZ0luLmJpcnRoZGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlVzZXIgbm90IGZvdW5kXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFZhbHVlc1NlcnZpY2Uuc2V0TG9nZ2VkSW5Vc2VyKGxvZ2luKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGxvZ2luLmlzZmlyc3R0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbYHVwZGF0ZXNlY3VyaXR5ZGV0YWlsc2BdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtgZGFzaGJvYXJkYF0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7dGhpcy5yb3V0ZXIubmF2aWdhdGUoW2BhZHZlcnRgXSl9LCAyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=