"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsNotificationService = exports.EmailNotificationService = void 0;
var EmailNotificationService = /** @class */ (function () {
    function EmailNotificationService() {
    }
    EmailNotificationService.prototype.sendNotification = function (userId, message) {
        console.log("email notification sent: ".concat(message, " to user ").concat(userId));
    };
    return EmailNotificationService;
}());
exports.EmailNotificationService = EmailNotificationService;
var SmsNotificationService = /** @class */ (function () {
    function SmsNotificationService() {
    }
    SmsNotificationService.prototype.sendNotification = function (userId, message) {
        console.log("sms notification sent: ".concat(message, " to user ").concat(userId));
    };
    return SmsNotificationService;
}());
exports.SmsNotificationService = SmsNotificationService;
