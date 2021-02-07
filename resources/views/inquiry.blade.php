@extends('layout/app')

@section('content')

<div class="container-fluid">
	<div class="row justify-content-center">
		
		<div class="col-md-3 extract-result bill-image">
			<div id="billImageCarousel" class="carousel slide" data-ride="carousel" role='root'>
				<div class="carousel-inner" role="container">
					<div class="carousel-item active">
						<img class="d-block w-100" src="/storage/{{ $inquiry->path }}/{{ $inquiry->filename }}" alt="{{ $inquiry->filename }}">
						<div class="card-img-overlay">
							<h5 class="card-title text-danger">Ảnh: {{ $inquiry->filename }}</h5>
						</div>
					</div>
				</div>

				<a class="carousel-control-prev" href="#billImageCarousel" role="button" data-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="sr-only">Previous</span>
				  </a>
				  <a class="carousel-control-next" href="#billImageCarousel" role="button" data-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="sr-only">Next</span>
				  </a>
			</div>
			
		</div>
		
		<div class="col-md-6 extract-result">
			<!-- general form elements -->
			<div class="info-box" id="pre-processing">
				<span class="info-box-icon bg-info" role="state"><span class="spinner-border text-white"></span></span>
				<div class="info-box-content">
				  <span class="info-box-text"><small>Preprocessing</small></span>
				  <span class="info-box-text text-primary" role="message" style="white-space: break-spaces;">Tiền xử lý hình ảnh</span>
				</div>
				<!-- /.info-box-content -->
			</div>

			<div class="info-box" style="display: none" id="bill-type">
				<span class="info-box-icon bg-info" role="state"><span class="spinner-border text-white"></span></span>
				<div class="info-box-content">
				  <span class="info-box-text"><small>Nhận dạng loại hoá đơn</small></span>
				  <span class="info-box-text text-primary" style="white-space: break-spaces;"><span role="message">Đang xử lý...</span></span>
				</div>
				<!-- /.info-box-content -->
			</div>

			<div class="info-box" style="display: none" id="bill-extraction">
				<span class="info-box-icon bg-info" role="state"><span class="spinner-border text-white"></span></span>
				<div class="info-box-content">
				  <span class="info-box-text"><small>Trích xuất thông tin hoá đơn</small></span>
				  <span class="info-box-text text-primary" style="white-space: break-spaces;"><span role="message">Đang xử lý...</span></span>
				</div>
				<!-- /.info-box-content -->
			</div>

			<div class="card card-info" style="display: none" id="bill-extraction-data">
				<div class="card-body" role="container">
					<table class="table"><tbody>
							<tr>
								<td colspan=2><strong>Danh sách sản phẩm</strong></td>
							</tr>
						</tbody>
					</table>
				</div>
				<!-- /.card-body -->
			</div>
			<!-- /.card -->
		</div>
		<!--/.col (right) -->
	</div>
	<!-- /.row -->
</div>
@endsection
