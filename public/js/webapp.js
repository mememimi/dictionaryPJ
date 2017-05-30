
var ap = angular.module('ap', ['ngRoute', 'ngResource']);
     ap.config(['$routeProvider', function($routeProvider) {
  $routeProvider //라우트별로 컨트롤러 설정해줄수있다
  .when('/', {
      templateUrl: 'main.html',
      controller: 'samCtrl'
    })
    .when('/add', {
      templateUrl: 'add.html',
      controller: 'addCtrl'
    })
    .when('/update/:nid', {
      templateUrl: 'update.html',
      controller: 'upCtrl'
    })
    .when('/check', {
      templateUrl: 'check.html',
      controller: 'ckCtrl'
    })
    .when('/listnow', {
      templateUrl: 'now.html',
      controller: 'nowCtrl'
    })
    .when('/apply/:dd', {
      templateUrl: 'apply.html',
      controller: 'apCtrl'
    })
    .otherwise({ //여기서 설정해주는것때문에 알아서 들어가진다
      redirectTo: '/' 
    });
}]);

ap.factory('upService', ['$resource', function($resource) {
  return $resource('/update/:nid'); //이 주소에서 데이터받아오려고 만든 서비스...
}]);                                                                                                                                                         

      ap.controller('samCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $scope.lists = [];       
        /*$http.get('/api/word').success(function(data) {//원래는 접속하자마자 기본출력해주는부분인데 지금은 저라우트를 막아놔서안뜸           
          $scope.lists = data;
          $rootScope.$emit('log', 'GET /lists success');//이 부분이 있어야 불러온값이 출력된다
                  
        });*/
      
        $scope.submit = function() {//제출버튼클릭시 돌아갈함수
        if ($scope.text) {
          var pp=$scope.text;//입력창에 들어온값에 접근
        
          $http.get('/search/'+pp).success(function(data) {           
          $scope.lists = data;
          $scope.idv=data._id;
         
          $rootScope.$emit('log', 'GET /lists success');//이 부분이 있어야 불러온값이 출력된다          
        
      });
          //$scope.list.push(this.text);//변수list에 값 추가해주는코드
        }
      };

      }]);

      ap.controller('nowCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $scope.lists = [];       
        $http.get('/listnow').success(function(data) {//접속하자마자 기본출력해주는부분
         $scope.lists = data;
          $rootScope.$emit('log', 'GET /lists success');//이 부분이 있어야 불러온값이 출력된다
                  
        });

      }]);

      ap.controller('ckCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $scope.lists = [];       
        $http.get('/check').success(function(data) {//접속하자마자 기본출력해주는부분
         $scope.lists = data;
          $rootScope.$emit('log', 'GET /lists success');//이 부분이 있어야 불러온값이 출력된다
                  
        });

      }]);

      ap.controller('addCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        
        $scope.ok = [{
          first: '<추가 기록>'
        }];
      $scope.submitadd = function() {//추가하는 페이지에서 입력마치고 눌러서 save해줄버튼

         if ($scope.addmean &&$scope.addpos&&$scope.addname) {

            var aa=$scope.addname;
            var bb=$scope.addpos;
            var cc=$scope.addmean;
           $http.put('/test/save/'+aa+'/'+bb+'/'+cc,{cache: true});//디비저장라우트콜
                                      //cache:옵션 안주면 콜을 3회씩 해서 데이터 똑같은게 3번저장된다
              $scope.ok.push({
              first: '단어가 추가되었습니다'//문장이 추가되면서 웹에서도 변화 알아볼수있게했다
              });

          $scope.addname=$scope.addpos=$scope.addmean='';//칸에 입력되어있던거 지워주기
                  // alert("저장되었습니다^^");
           //$scope.list.push(this.text);//변수list에 값 추가해주는코드
          } 
       };
      }]);  

      ap.controller('upCtrl', ['$scope', '$routeParams','upService','$q','$http', '$rootScope', function($scope,$routeParams,service,$q, $http, $rootScope) {
         $scope.list = [];
         $q.all([//promise들 한번에 묶어서처리
        service.get({   
          nid: $routeParams.nid    //굳이 서비스를 써서 이렇게 받아오기는 했는데
        }).$promise,              //그냥 http.get으로 해도 됬을거같긴하지만테스트는안해봄
        
        ]).then(function(values)
         { $scope.list = values; });
         $rootScope.$emit('log', 'GET /lists success');//이코드가있어야 화면에출력된다

        $scope.uk = [{
          first: '<수정 기록>'
        }];
      $scope.submitup = function() {//추가하는 페이지에서 입력마치고 눌러서 save해줄버튼

         if ($scope.upname &&$scope.uppos&&$scope.upmean) {
            var qq=$scope.upname;
            var ww=$scope.uppos;
            var ee=$scope.upmean;
            var rr=$routeParams.nid;
           $http.put('/update/'+rr+'/'+qq+'/'+ww+'/'+ee,{cache: true});
              $scope.uk.push({
              first: '단어가 수정되었습니다'
              });
                             // console.log("step 444");

          $scope.upname=$scope.uppos=$scope.upmean='';//칸에 입력되어있던거 지워주기
          } 
       };
      }]);  

ap.controller('apCtrl', ['$scope','$routeParams', '$http', '$rootScope', function($scope,$routeParams, $http, $rootScope) {

         $scope.listo = [];
          var dd = $routeParams.dd    //굳이 서비스를 써서 이렇게 받아오기는 했는데
       //var kk;
        $http.get('/check/'+dd).success(function(data) {//접속하자마자 기본출력해주는부분
         $scope.listo = data;
          $rootScope.$emit('log', 'GET /lists success');//이 부분이 있어야 불러온값이 출력된다
                  
        });
    //console.log(kk);
        $scope.uk = [{
          first: '<추가 기록>'
        }];
      $scope.submitap = function() {//추가하는 페이지에서 입력마치고 눌러서 save해줄버튼

         if ($scope.uppos&&$scope.upmean) {
            var bb=$scope.uppos;
            var cc=$scope.upmean;
        $http.put('/test/save/'+dd+'/'+bb+'/'+cc,{cache: true});
              $scope.uk.push({
              first: '단어가 추가되었습니다'
              });
                             // console.log("step 444");
          $scope.uppos=$scope.upmean='';//칸에 입력되어있던거 지워주기
          } 
       };
       $scope.rmv = function() {
         $http.post('/exeptrqst/'+dd);
         $scope.uk.push({
              first: 'DB에서 삭제되었습니다!'
              });
       }
      }]);  
