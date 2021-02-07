/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _$$dropzone;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
Dropzone.autoDiscover = false;
$(".carousel").carousel();
$("#uploadBill").dropzone((_$$dropzone = {
  maxFilesize: 10,
  url: "/upload-bill",
  acceptedFiles: "image/jpg, image/jpeg, image/png",
  maxFiles: 1
}, _defineProperty(_$$dropzone, "maxFilesize", 10), _defineProperty(_$$dropzone, "addRemoveLinks", true), _defineProperty(_$$dropzone, "capture", true), _defineProperty(_$$dropzone, "dictDefaultMessage", "Tải lên ảnh chụp của hoá đơn<br/>*.jpg"), _defineProperty(_$$dropzone, "success", function success(file, response) {
  $(document).Toasts('create', {
    "class": 'bg-success',
    title: 'Upload success',
    position: 'bottomRight',
    delay: 750,
    autohide: true,
    body: 'Đã tải ảnh ' + file.name + ' lên server thành công'
  });
  window.location.href = '/inquiry/' + response.id + "/";
}), _$$dropzone));
$(function () {
  if ($('#pre-processing').length > 0) {
    preProcessing();
  }
});

function preProcessing() {
  $.ajax({
    url: 'preprocessing',
    type: 'POST',
    success: function success(res) {
      $("#pre-processing [role='message']").html("Tiền xử lý hình ảnh thành công");
      $("#pre-processing [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>');
      $(document).Toasts('create', {
        "class": 'bg-success',
        title: 'Success',
        position: 'bottomRight',
        delay: 750,
        autohide: true,
        body: 'Xử lý ảnh thành công'
      });

      if (res.images && _typeof(res.images) == "object") {
        for (image in res.images) {
          appendPreviewImage(res.images[image], image);
        }
      }

      detectBillType();
    },
    error: function error(xhr, status, _error) {
      $("#pre-processing [role='message']").html(xhr.responseJSON.message);
      $("#pre-processing [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>');
      $(document).Toasts('create', {
        "class": 'bg-danger',
        title: 'Error',
        position: 'bottomRight',
        body: 'Có lỗi xảy ra trong quá trình xử lý ảnh'
      });
    }
  });
}

function detectBillType() {
  $("#bill-type").show();
  $.ajax({
    url: 'detect-bill-type',
    type: 'POST',
    success: function success(res) {
      detectBillTypeResult();
    },
    error: function error(xhr, status, _error2) {
      toastr.error(xhr.responseJSON.message);
    }
  });
}

function detectBillTypeResult() {
  $.ajax({
    url: 'detect-bill-type-result',
    type: 'POST',
    success: function success(res) {
      if (!res.completed) {
        if (res.message && res.message != window.lastMessage) {
          $("#bill-type [role='message']").html(res.message);
          window.lastMessage = res.message;
        }

        return setTimeout(detectBillTypeResult, 1000);
      }

      if (res.isSupported) {
        $("#bill-type [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>');
        $("#bill-type [role='message']").html("Cửa hàng: " + res.name + " [" + res.confidence + "%]");
        $(document).Toasts('create', {
          "class": 'bg-success',
          title: 'Success',
          position: 'bottomRight',
          delay: 750,
          autohide: true,
          body: 'Nhận dạng loại hoá đơn thành công'
        });

        if (res.images && _typeof(res.images) == "object") {
          for (image in res.images) {
            appendPreviewImage(res.images[image], image);
          }
        }

        extractBillData();
      } else {
        $("#bill-type [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>');

        if (res.message == "Unsupported") {
          $("#bill-type [role='message']").html("Loại hoá đơn không được hỗ trợ hoặc ảnh chụp không rõ hoá đơn");
          $(document).Toasts('create', {
            "class": 'bg-danger',
            title: 'Error',
            position: 'bottomRight',
            body: 'Loại hoá đơn này không được hỗ trợ'
          });
          return;
        } else {
          $("#bill-type [role='message']").html(res.message);
          $(document).Toasts('create', {
            "class": 'bg-danger',
            title: 'Error',
            position: 'bottomRight',
            body: 'Xảy ra lỗi trong quá trình xử lý'
          });
          return;
        }
      }
    },
    error: function error(xhr, status, _error3) {
      setTimeout(detectBillTypeResult, 1000);
    }
  });
}

function extractBillData() {
  $("#bill-extraction").show();
  $("#processing-status").html("Đang trích xuất thông tin hoá đơn");
  $.ajax({
    url: 'extract',
    type: 'POST',
    success: function success(res) {
      extractBillDataResult();
    },
    error: function error(xhr, status, _error4) {
      toastr.error(xhr.responseJSON.message);
    }
  });
}

function extractBillDataResult() {
  $.ajax({
    url: 'extract-result',
    type: 'POST',
    datatype: 'json',
    success: function success(res) {
      if (!res.completed) {
        return setTimeout(extractBillDataResult, 1000);
      }

      var data = res.data;

      if (data.success) {
        if (res.images) {
          for (image in res.images) {
            appendPreviewImage(res.images[image], image);
          }
        }

        $("#bill-extraction-data").show();
        var dom = '<table class="table"><tbody>';
        dom += "<tr><td>Website</td><td>".concat(data.website, "</td></tr>");
        dom += "<tr><td>\u0110\u1ECBa ch\u1EC9</td><td>".concat(data.address, "</td></tr>");
        dom += "<tr><td>S\u1ED1 H\u0110</td><td>".concat(data.id, "</td></tr>");
        dom += "<tr><td>Ng\xE0y l\u1EADp H\u0110</td><td>".concat(data.date, "</td></tr>");
        dom += "<tr><td>Nh\xE2n vi\xEAn</td><td>".concat(data.cashier, "</td></tr>");
        dom += "<tr><td>S\u1ED1 s\u1EA3n ph\u1EA9m</td><td>".concat(data.items ? data.items.length : 'N/a', "</td></tr>");
        dom += "<tr><td>Th\xE0nh ti\u1EC1n</td><td>".concat(data.amount || 'N/a', "</td></tr>");
        dom += '</tbody></table>';

        if (data.items) {
          dom += '<div class="text-primary mt-3 text-bold">Danh sách các sản phẩm</div>';
          dom += '<table class="table"><thead><tr><th>#</th><th>Sản phẩm</th><th>Số lượng</th><th>Giá bán</th><th>Thành tiền</th></tr></thead><tbody>';

          for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            dom += "<tr><td>".concat(i + 1, "</td><td>").concat(item.item, "</td><td>").concat(item.quantity, "</td><td>").concat(item.price, "</td><td>").concat(item.amount, "</td></tr>");
          }

          dom += '</tbody></table>';
        }

        $("#bill-extraction-data [role='container']").append(dom);
        $("#bill-extraction [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>');
        $("#bill-extraction [role='message']").html("Thành công");
      } else {
        $("#bill-extraction [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>');
        $("#bill-extraction [role='message']").html(data.message);
        $(document).Toasts('create', {
          "class": 'bg-danger',
          title: 'Error',
          position: 'bottomRight',
          body: 'Có lỗi xảy ra trong quá trình xử lý'
        });
      }
    },
    error: function error(xhr, status, _error5) {
      setTimeout(extractBillDataResult, 1000);
    }
  });
}

function appendPreviewImage(src, title) {
  var dom = '<div class="carousel-item"><img class="d-block w-100" src="' + src + '" alt="' + title + '"><div class="card-img-overlay"><h5 class="card-title text-danger">' + title + '</h5></div></div>';
  $(".bill-image [role='container']").append(dom); // $(".bill-image [role='container'] > div:first-child").addClass('active');
}

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./resources/sass/vendor.scss":
/*!************************************!*\
  !*** ./resources/sass/vendor.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!******************************************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ./resources/sass/vendor.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /var/www/vra/resources/js/app.js */"./resources/js/app.js");
__webpack_require__(/*! /var/www/vra/resources/sass/app.scss */"./resources/sass/app.scss");
module.exports = __webpack_require__(/*! /var/www/vra/resources/sass/vendor.scss */"./resources/sass/vendor.scss");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map