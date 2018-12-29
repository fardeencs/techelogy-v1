import { Component, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { UserIdentityService } from '../../services/user_identity.service';
import { UserModel } from '../../models/user/user.model';
import { Location } from '@angular/common';
import { SESSION } from '../../modules';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends BaseComponent {
  subtitle: string;
  public salesCounters: Array<Object>;
  public marketingCounters: Array<Object>;
  public logisticsCounters: Array<Object>;
  public customerCounters: Array<Object>;
  public financeCounters: Array<Object>;
  public integrityCounters: Array<Object>;
  public merchantCounters: Array<Object>;
  public merchentApprovalPendingLists: Array<Object>;
  public merchentMembershipExpiredLists: Array<Object>;
  public skuApprovalPendingLists: Array<Object>;
  public logisticApprovalPendingLists: Array<Object>;
  public marketingOnlineLists: Array<Object>;
  public merchantAlertLists: Array<Object>;
  public merchantMessagesLists: Array<Object>;
  public merchantComplaintsLists: Array<Object>;
  public topproducts: Array<Object>;
  public stockOverview: Array<Object>;
  public profile: UserModel;
  constructor(protected _router: Router, protected _location: Location) {
    super(_router, _location);
    if (sessionStorage.getItem(SESSION.LANGUAGE_KEYWORD)) {
      sessionStorage.setItem(SESSION.LANGUAGE_KEYWORD, 'en');
    }
    this.salesCounters = [
      {
        name: 'Total Orders',
        value: '1250',
        colorClass: 'bg-info',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Total Sales',
        value: '$ 1050.00',
        colorClass: 'bg-warning',
        icon: 'fa fa-dollar'
      }, {
        name: 'Total Brands',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-star'
      }, {
        name: 'Total GMV',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-money'
      }, {
        name: 'Total SKUs',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-tag'
      }, {
        name: 'Total Merchants',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-users'
      }, {
        name: 'Total Halal SKUs',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-tag'
      }
    ];

    this.marketingCounters = [
      {
        name: 'Total Sign Up',
        value: '1250',
        colorClass: 'bg-info',
        icon: 'fa fa-user-plus'
      }, {
        name: 'Active Promotions',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-bullhorn'
      }, {
        name: 'Active Contest',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-trophy'
      }, {
        name: 'Referral Code',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-code'
      }, {
        name: 'Total Abandon Cart',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Now Online',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-lightbulb-o'
      }
    ];

    this.logisticsCounters = [
      {
        name: 'Total Orders',
        value: '1250',
        colorClass: 'bg-info',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'In Transit',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-truck'
      }, {
        name: 'Not Shipped',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-truck'
      }, {
        name: 'Free Shipping Orders',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-truck'
      }, {
        name: 'Return Shipment',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-truck'
      }, {
        name: 'Orders Delivered',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'My Approvals',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-check'
      }, {
        name: 'Merchant Shipment',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-truck'
      }
    ];

    this.customerCounters = [
      {
        name: 'Active Orders',
        value: '1250',
        colorClass: 'bg-info',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Total Orders',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Total Refunds',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Total Returns',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-repeat'
      }, {
        name: 'Total Cancellations',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-times'
      }, {
        name: 'Comment Approval',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-check'
      }
    ];

    this.financeCounters = [
      {
        name: 'Total Sales',
        value: '$ 1250.00',
        colorClass: 'bg-info',
        icon: 'fa fa-dollar'
      }, {
        name: 'Total Refunds',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-repeat'
      }, {
        name: 'Total Canceled',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-times'
      }, {
        name: 'Total Invoices',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-file'
      }, {
        name: 'My Approvals',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-check'
      }, {
        name: 'Total GMV',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-money'
      }, {
        name: 'Total GP Issued',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-arrow-right'
      }, {
        name: 'Total GP Redeem',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-arrow-left'
      }
    ];

    this.integrityCounters = [
      {
        name: 'Halal Expiry',
        value: '1250',
        colorClass: 'bg-info',
        icon: 'fa fa-exclamation-circle'
      }, {
        name: 'CTC Contract Expiry',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-exclamation-circle'
      }, {
        name: 'New SKUs',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-tag'
      }, {
        name: 'Additional SKUs',
        value: '100',
        colorClass: 'bg-primary',
        icon: 'fa fa-tag'
      }, {
        name: 'My Approvals',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-check'
      }, {
        name: 'NPRA Approval',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-check'
      }, {
        name: 'NPRA Expiry',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-exclamation-circle'
      }, {
        name: 'KLIU Expiry',
        value: '100',
        colorClass: 'bg-success',
        icon: 'fa fa-exclamation-circle'
      }
    ];

    this.merchantCounters = [
      {
        name: 'Rating',
        value: '4.5',
        colorClass: 'bg-info',
        icon: 'fa fa-star'
      }, {
        name: 'Total Products',
        value: '1020',
        colorClass: 'bg-warning',
        icon: 'fa fa-tag'
      }, {
        name: 'Stock Value',
        value: '$ 1500.00',
        colorClass: 'bg-success',
        icon: 'fa fa-dollar'
      }, {
        name: 'Sales Statistics',
        value: '$ 1200.00',
        colorClass: 'bg-primary',
        icon: 'fa fa-money'
      }, {
        name: 'Order Statistics',
        value: '100',
        colorClass: 'bg-danger',
        icon: 'fa fa-shopping-cart'
      }, {
        name: 'Dispatch Statistics',
        value: '100',
        colorClass: 'bg-warning',
        icon: 'fa fa-truck'
      }, {
        name: 'Return Statistics',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-repeat'
      }, {
        name: 'Delivery Statistics',
        value: '100',
        colorClass: 'bg-info',
        icon: 'fa fa-truck'
      }
    ];

    this.merchentApprovalPendingLists = [
      {
        heading: 'Pending Approval Merchants',
        lists: [
          {
            icon: 'fa fa-bell',
            comment: 'You have new merchant(named John) approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new merchant(named John) approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new merchant(named John) approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new merchant(named John) approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new merchant(named John) approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }
        ]
      }
    ];

    this.merchentMembershipExpiredLists = [
      {
        heading: 'Merchant Membership Expired',
        lists: [
          {
            icon: 'fa fa-bell',
            comment: 'John Doe (Merchant) membership is about to expire.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-bell',
            comment: 'John Doe (Merchant) membership is about to expire.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-bell',
            comment: 'John Doe (Merchant) membership is about to expire.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-bell',
            comment: 'John Doe (Merchant) membership is about to expire.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-bell',
            comment: 'John Doe (Merchant) membership is about to expire.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }
        ]
      }
    ];

    this.skuApprovalPendingLists = [
      {
        heading: 'Pending SKUs Approval',
        lists: [
          {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }
        ]
      }
    ];

    this.logisticApprovalPendingLists = [
      {
        heading: 'My Approvals',
        lists: [
          {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new merchant approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new sku approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new approval pending.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }
        ]
      }
    ];

    this.marketingOnlineLists = [
      {
        heading: 'Now Online',
        lists: [
          {
            icon: 'fa fa-user',
            comment: 'John is online now.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-user',
            comment: 'John is online now.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-user',
            comment: 'John is online now.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-user',
            comment: 'John is online now.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }, {
            icon: 'fa fa-user',
            comment: 'John is online now.',
            date: '01-02-2019 01-02 AM',
            actions: []
          }
        ]
      }
    ];

    this.merchantAlertLists = [
      {
        heading: 'Alerts',
        lists: [
          {
            icon: 'fa fa-bell',
            comment: 'You have new order $25.00.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new customer rating.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'Accept',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }, {
                link: 'javascript:void(0)',
                label: 'Reject',
                labelIcon: '',
                colorClass: 'btn-outline-inverse'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'Your sku is approved by Admin.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new order $20.00.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-bell',
            comment: 'You have new order $15.00.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }
        ]
      }
    ];

    this.merchantMessagesLists = [
      {
        heading: 'Messages',
        lists: [
          {
            icon: 'fa fa-comment',
            comment: 'Sales team replied on your query.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-comment',
            comment: 'Support wants to know your plan.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-comment',
            comment: 'You have a new message from Admin.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-comment',
            comment: 'You have a new message from Admin.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-comment',
            comment: 'You have a new message from Admin.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }
        ]
      }
    ];

    this.merchantComplaintsLists = [
      {
        heading: 'Complaints',
        lists: [
          {
            icon: 'fa fa-frown-o',
            comment: 'You have new complaint for your order - ORDER-125222520.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-frown-o',
            comment: 'You have new complaint for your order - ORDER-125222520.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-frown-o',
            comment: 'You have new complaint for your delivery.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-frown-o',
            comment: 'You have new complaint for your delivery.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }, {
            icon: 'fa fa-frown-o',
            comment: 'You have new complaint for your delivery.',
            date: '01-02-2019 01-02 AM',
            actions: [
              {
                link: 'javascript:void(0)',
                label: 'View',
                labelIcon: '',
                colorClass: 'btn-outline-danger'
              }
            ]
          }
        ]
      }
    ];

    this.topproducts = [
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/4968201704141704284879.jpg',
        name: 'Grips Men Get Up Tee Shirt',
        category: 'Men',
        price: '$ 25.00',
        sale: 65
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/2390201802221745168036.jpg',
        name: 'Dianaku Khimar Nayla Baby Blue',
        category: 'Women',
        price: '$ 33.00',
        sale: 50
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/3297201702021811259718.jpg',
        name: 'Bonia Classic Bucket Bag Blush Pink',
        category: 'Accessories',
        price: '$ 400.00',
        sale: 42
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/3114201705081220517605.jpg',
        name: 'Letter Embellishment Solid Ring',
        category: 'Accessories',
        price: '$ 22.50',
        sale: 35
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/8780201703212028073298.jpg',
        name: 'Action Sport Camera Yellow',
        category: 'Electronics',
        price: '$ 255.00',
        sale: 32
      }
    ];

    this.stockOverview = [
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/2169201704141755049146.jpg',
        name: 'Grips Polar Fleece Hoodie',
        category: 'Men',
        price: '$ 31.00',
        qty: 2
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/8554201612301650337669.jpg',
        name: 'Vercato Daly Modern Malay Kurung ',
        category: 'Women',
        price: '$ 50.00',
        qty: 0
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/2031201705051204561563.jpg',
        name: '110 Foldable Wired Stereo Headphones ',
        category: 'Electronics',
        price: '$ 350.00',
        qty: 6
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/3114201705081220517605.jpg',
        name: 'Letter Embellishment Solid Ring',
        category: 'Accessories',
        price: '$ 22.50',
        qty: 3
      },
      {
        image: 'https://image.aladdinstreet.com/uploads/catalog_thumbnail/8780201703212028073298.jpg',
        name: 'Action Sport Camera Yellow',
        category: 'Electronics',
        price: '$ 255.00',
        qty: 1
      }
    ];
    if (UserIdentityService.getProfile()) {
      this.profile = UserIdentityService.getProfile();
    }
  }
}
