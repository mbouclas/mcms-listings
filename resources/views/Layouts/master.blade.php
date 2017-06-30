<!doctype html>
<html lang="en" ng-app="mcms">
<head>
    <meta charset="UTF-8">
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/angular-material.min.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/md-data-table.min.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/redactor.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/dropzone.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/md-chips-select.min.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/custom.css')}}"
          media="screen,projection"/>
    <link type="text/css" rel="stylesheet" href="{{asset('package-admin/css/angular-ui-tree.min.css')}}"
          media="screen,projection"/>

    <title>Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #eeeeee;

            font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        }

        #MainContentContainer { background-color: #eeeeee; }
    </style>
</head>
<body layout="column">
<header-component ng-if="ACL.isLoggedIn()"></header-component>

<div class="container" layout="row" flex>
<side-bar-nav ng-if="ACL.isLoggedIn()"></side-bar-nav>
    <md-content flex id="MainContentContainer">
        <div  layout-fill ng-cloak>
            <div ng-view layout-padding=""></div>
        </div>




        @yield('css')
        @yield('content')
        <script>
            {!! $JS !!}
        </script>

        <script src="{{asset('package-admin/js/admin.components.js')}}"></script>

        <script src="{{asset('package-admin/js/admin.app.js')}}"></script>
        @yield('js')
    </md-content>

</div>


</body>
</html>