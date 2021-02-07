@extends('layout/app')

@section('content')

<div class="container-fluid">
	<div class="row justify-content-center">
		@if ($inquiries->count() == 0)
		<div class="col-6">
			<div class="callout callout-danger">
				<h5><i class="icon fas fa-info"></i> Thông tin</h5>
				Chưa thực hiện yêu cầu nào !!
			</div>
		</div>
		@endif
		{{-- <div class="card-deck"> --}}
			@foreach ($inquiries as $inquiry)
				<div class="col-12 col-md-6 col-lg-4 col-xl-3 p-2">
					<a class="card" href="/inquiry/{{ $inquiry->uuid }}/">
						<img class="card-img-top img-fluid" src="/storage/{{ $inquiry->path }}/original.jpg" alt="{{ $inquiry->filename }}" style="max-height:300px">
						<div class="card-body">
							<h5 class="card-title">{{ $inquiry->filename }}</h5>
							<p class="card-text"><small class="text-muted">{{ $inquiry->created_at }}</small></p>
						</div>
					</a>
				</div>
			@endforeach
		{{-- </div> --}}
	</div>
</div>
@endsection
