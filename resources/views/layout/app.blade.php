<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Rút trích thông tin hoá đơn</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
  <link href="{{ mix('assets/css/app.css') }}" rel="stylesheet" />
  <link href="{{ mix('assets/css/vendor.css') }}" rel="stylesheet" />
  <script src="{{ mix('/assets/js/vendor.js') }}" defer></script>
  <script src="{{ mix('/assets/js/app.js') }}" defer></script>
  
  <!-- Google Font: Source Sans Pro -->
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
</head>
<body class="hold-transition layout-navbar-fixed sidebar-collapse">
  <div class="wrapper">
    
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-dark">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="/" class="nav-link">New</a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="/history" class="nav-link">History</a>
        </li>
      </ul>
      
    </nav>
    <!-- /.navbar -->
    
    
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <section class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1>Bill Data Extraction</h1>
            </div>
          </div>
        </div><!-- /.container-fluid -->
      </section>
      
      <!-- Main content -->
      <section class="content">
        @yield('content')  
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
    <footer class="main-footer">
      <strong>VRA </strong>@CS2225.CH1501.N013
    </footer>
  </div>
  <!-- ./wrapper -->
</body>
</html>
