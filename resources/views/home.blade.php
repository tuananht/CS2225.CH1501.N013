@extends('layout/app')

@section('content')

<div class="container-fluid">
	<div class="row justify-content-center">
		<!-- left column -->
		<div class="col-md-6" id="bill_upload_column">
			<!-- general form elements -->
			<div class="card card-primary">
				<div class="card-header">
					<h3 class="card-title">Trích xuất thông tin từ hoá đơn</h3>
				</div>
				<!-- /.card-header -->
				<!-- form start -->
				<div class="card-body">
					<form role="form" action="/bill-extract" class="dropzone" method="post" id="uploadBill">
						<div class="fallback">
							<input name="file" type="file" />
						</div>
						@csrf
					</form>
				</div>
				<!-- /.card-body -->
			</div>
			
			<div>
				<a type="button" class="btn btn-block btn-outline-danger" href="/storage/sample.jpg" target="_blank"> <i class="fas fa-download"></i> Tải xuống các hoá đơn mẫu <i class="fas fa-download"></i> </a>
			</div>
			<div>
				<p class="text-primary mt-5" >
					Minh hoạ ứng dụng thực hiện rút trích thông tin từ ảnh chụp hoá đơn của cửa hàng Bách Hoá Xanh
				</p>
				<p class="text-primary" >
					B1: Tải lên ảnh chụp của hoá đơn<br/>
					B2: Sử dụng thuật toán YOLO để kiểm tra xem có phải hoá đơn của Bách Hoá Xanh hay không? Nếu đúng, tiếp tục bước 3.<br/>
					B3: Rút trích thông tin từ hoá đơn.<br/>
				</p>
			</div>
			<!-- /.card -->
		</div>
	</div>
	<!-- /.row -->
</div>
@endsection
