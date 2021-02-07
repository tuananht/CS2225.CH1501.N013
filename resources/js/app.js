$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});

Dropzone.autoDiscover = false;
$(".carousel").carousel();

$("#uploadBill").dropzone({
	maxFilesize: 10,
	url: "/upload-bill",
	acceptedFiles: "image/jpg, image/jpeg, image/png",
	maxFiles: 1,
	maxFilesize: 10,
	addRemoveLinks: true,
	capture:true,
	dictDefaultMessage: "Tải lên ảnh chụp của hoá đơn<br/>*.jpg",
	success: function( file, response ){
		$(document).Toasts('create', {
			class: 'bg-success',
			title: 'Upload success',
			position: 'bottomRight',
			delay: 750,
			autohide: true,
			body: 'Đã tải ảnh ' + file.name + ' lên server thành công'
		  })
		window.location.href = '/inquiry/' + response.id + "/";
	}
})

$(function(){
	
	if ($('#pre-processing').length > 0){
		preProcessing();
	}
})

function preProcessing(){

	$.ajax({
		url: 'preprocessing',
		type: 'POST',
		success: function(res){
			$("#pre-processing [role='message']").html("Tiền xử lý hình ảnh thành công");
			$("#pre-processing [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>')
			$(document).Toasts('create', {
				class: 'bg-success',
				title: 'Success',
				position: 'bottomRight',
				delay: 750,
				autohide: true,
				body: 'Xử lý ảnh thành công'
			  })
			if(res.images && typeof res.images == "object"){
				for(image in res.images){
					appendPreviewImage(res.images[image], image)
				}
			}
			detectBillType();
		},
		error: function(xhr, status, error){
			$("#pre-processing [role='message']").html(xhr.responseJSON.message);
			$("#pre-processing [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>')
			$(document).Toasts('create', {
				class: 'bg-danger',
				title: 'Error',
				position: 'bottomRight',
				body: 'Có lỗi xảy ra trong quá trình xử lý ảnh'
			  })
		},
	})
}

function detectBillType(){
	$("#bill-type").show();

	$.ajax({
		url: 'detect-bill-type',
		type: 'POST',
		success: function(res){
			detectBillTypeResult()
		},
		error: function(xhr, status, error){
			toastr.error(xhr.responseJSON.message)
		},
	})
}

function detectBillTypeResult(){
	$.ajax({
		url: 'detect-bill-type-result',
		type: 'POST',
		success: function(res){
			if(!res.completed){
				if(res.message && res.message != window.lastMessage){
					$("#bill-type [role='message']").html(res.message);
					window.lastMessage = res.message;
				}
				return setTimeout(detectBillTypeResult, 1000);
			}

			if(res.isSupported){
				$("#bill-type [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>')
				$("#bill-type [role='message']").html("Cửa hàng: " + res.name + " [" + res.confidence + "%]");
				$(document).Toasts('create', {
					class: 'bg-success',
					title: 'Success',
					position: 'bottomRight',
					delay: 750,
					autohide: true,
					body: 'Nhận dạng loại hoá đơn thành công'
				  })
				if(res.images && typeof res.images == "object"){
					for(image in res.images){
						appendPreviewImage(res.images[image], image)
					}
				}
				extractBillData()
			}
			
			else{
				$("#bill-type [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>')

				if(res.message == "Unsupported"){
					$("#bill-type [role='message']").html("Loại hoá đơn không được hỗ trợ hoặc ảnh chụp không rõ hoá đơn")
					$(document).Toasts('create', {
						class: 'bg-danger',
						title: 'Error',
						position: 'bottomRight',
						body: 'Loại hoá đơn này không được hỗ trợ'
					  })
					return;
				}else{
					$("#bill-type [role='message']").html(res.message)
					$(document).Toasts('create', {
						class: 'bg-danger',
						title: 'Error',
						position: 'bottomRight',
						body: 'Xảy ra lỗi trong quá trình xử lý'
					  })
					return;
				}
				
			}
			
		},
		error: function(xhr, status, error){
			setTimeout(detectBillTypeResult, 1000);
		},
	})
}

function extractBillData(){
	$("#bill-extraction").show();

	$("#processing-status").html("Đang trích xuất thông tin hoá đơn")
	$.ajax({
		url: 'extract',
		type: 'POST',
		success: function(res){
			extractBillDataResult()
		},
		error: function(xhr, status, error){
			toastr.error(xhr.responseJSON.message)
		},
	})
}

function extractBillDataResult(){
	$.ajax({
		url: 'extract-result',
		type: 'POST',
		datatype: 'json',
		success: function(res){
			if(!res.completed){
				return setTimeout(extractBillDataResult, 1000);
			}

			var data = res.data;

			if(data.success){
				if(res.images){
					for(image in res.images){
						appendPreviewImage(res.images[image], image)
					}
				}

				$("#bill-extraction-data").show();
				let dom = '<table class="table"><tbody>';
				dom += `<tr><td>Website</td><td>${data.website}</td></tr>`;
				dom += `<tr><td>Địa chỉ</td><td>${data.address}</td></tr>`;
				dom += `<tr><td>Số HĐ</td><td>${data.id}</td></tr>`;
				dom += `<tr><td>Ngày lập HĐ</td><td>${data.date}</td></tr>`;
				dom += `<tr><td>Nhân viên</td><td>${data.cashier}</td></tr>`;
				dom += `<tr><td>Số sản phẩm</td><td>${data.items ? data.items.length : 'N/a'}</td></tr>`;
				dom += `<tr><td>Thành tiền</td><td>${data.amount || 'N/a'}</td></tr>`;
				dom += '</tbody></table>'

				if(data.items){
					dom += '<div class="text-primary mt-3 text-bold">Danh sách các sản phẩm</div>';
					dom += '<table class="table"><thead><tr><th>#</th><th>Sản phẩm</th><th>Số lượng</th><th>Giá bán</th><th>Thành tiền</th></tr></thead><tbody>';
					for (var i =0; i < data.items.length; i++){
						var item = data.items[i]
						dom += `<tr><td>${i+1}</td><td>${item.item}</td><td>${item.quantity}</td><td>${item.price}</td><td>${item.amount}</td></tr>`;
					}
					dom += '</tbody></table>';
				}

				$("#bill-extraction-data [role='container']").append(dom)
				$("#bill-extraction [role='state']").removeClass("bg-info").addClass("bg-success").html('<i class="fas fa-check"></i>')
				$("#bill-extraction [role='message']").html("Thành công");
			}else{
				$("#bill-extraction [role='state']").removeClass("bg-info").addClass("bg-danger").html('<i class="fas fa-times"></i>')
				$("#bill-extraction [role='message']").html(data.message);
				$(document).Toasts('create', {
					class: 'bg-danger',
					title: 'Error',
					position: 'bottomRight',
					body: 'Có lỗi xảy ra trong quá trình xử lý'
				  })
			}	
		},
		error: function(xhr, status, error){
			setTimeout(extractBillDataResult, 1000);
		},
	})
}

function appendPreviewImage(src, title){
	let dom = '<div class="carousel-item"><img class="d-block w-100" src="'+src+'" alt="'+title+'"><div class="card-img-overlay"><h5 class="card-title text-danger">'+title+'</h5></div></div>';
	$(".bill-image [role='container']").append(dom);
	// $(".bill-image [role='container'] > div:first-child").addClass('active');
}