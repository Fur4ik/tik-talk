"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d2_1 = require("./d2");
var OrderManager = /** @class */ (function () {
    function OrderManager(notificationService) {
        this.notificationService = notificationService;
    }
    OrderManager.prototype.createOrder = function (order) { };
    OrderManager.prototype.calculateOrder = function (order) { };
    OrderManager.prototype.saveOrder = function (order) {
        this.notificationService.sendNotification(order.userId, 'all is good');
    };
    return OrderManager;
}());
var firstOrder = { userId: 52, name: 'blinchici' };
var emailNotificationService = new d2_1.EmailNotificationService();
var smsNotificationService = new d2_1.SmsNotificationService();
var om = new OrderManager(smsNotificationService);
om.saveOrder(firstOrder);
