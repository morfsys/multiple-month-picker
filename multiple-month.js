var app=angular.module('app-name');
app.directive('multipleMonthDirective',function($timeout,$rootScope){
    return {
        restrict:'E',
        templateUrl:'multiple-month-template.html',
        link:function(scope,elem,attr){
            var val=attr.value;
            scope.var.selected_months=[];
            
                
            var patt=new RegExp('((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [0-9]{4},)+');
            $timeout(function(){
                if(patt.test(val+',')){
                    var ys=val.split(',');
                    for(var i=0;i<ys.length;i++){
                        var ind=-1;
                        var eys=ys[i].split(' ');
                        for(var j=0;j<scope.var.selected_months.length;j++){
                            if(scope.var.selected_months[j].year==eys[1]){
                                ind=j;
                                break;
                            }
                        }
                        if(ind<0){
                            ind=scope.var.selected_months.push({
                                year:eys[1],
                                months:[]
                            });
                            ind--;
                        }
                        scope.var.selected_months[ind].months.push(eys[0]);
                    }
                    scope.mmp.setSelectedMonths(moment().format('YYYY'));
                }
                $('.mw-ind').on('click',function(){
                    if($(this).hasClass('mwi-active')){
                        $(this).removeClass('mwi-active');
                    }else{
                        $(this).addClass('mwi-active');
                    }
                });
                $('.done-btn').on('click',function(){
                    scope.mmp.doneSelected(function(s){
                        $('input.'+attr.class).val(s).trigger('change').removeClass(attr.class);
                        $(elem).remove();
                    });
                });
                $('.reset-btn').on('click',function(){
                    scope.mmp.resetSelected();
                })

                $('.prev-year').on('click',function(){
                    scope.mmp.getCurrSelected(function(){
                        $('.curr-year').text(parseInt($('.curr-year').text())-1);
                        scope.mmp.setSelectedMonths($('.curr-year').text());
                    });
                });

                $('.next-year').on('click',function(){
                    scope.mmp.getCurrSelected(function(){
                        $('.curr-year').text(parseInt($('.curr-year').text())+1);
                        scope.mmp.setSelectedMonths($('.curr-year').text());
                    });
                });
        
            },100);
            
            scope.mmp={
                getCurrSelected:function (f){
                    var curr={
                        year:$('span.curr-year').text(),
                        months:[]
                    };
                    $('.mwi-active').each(function(){
                        curr.months.push($(this).text().trim());
                    }).promise().done(function(){
                        for(var i=0;i<scope.var.selected_months.length;i++){
                            if(scope.var.selected_months[i].year==curr.year){
                                scope.var.selected_months.splice(i,1);
                                break;
                            }
                        }
                        scope.var.selected_months.push(curr);
                        f();
                    });
                },
                setSelectedMonths:function (a){
                    if(a==undefined){
                        var a=$('.curr-year').text();
                    }
                    $('.mw-ind.mwi-active').each(function(){
                        $(this).removeClass('mwi-active');
                    }).promise().done(function(){
                        for(var i=0;i<scope.var.selected_months.length;i++){
                            if(scope.var.selected_months[i].year==a){
                                for(var j=0;j<scope.var.selected_months[i].months.length;j++){
                                    $('.mw-ind[data-month="'+scope.var.selected_months[i].months[j]+'"]').addClass('mwi-active');
                                }
                                break;
                            }
                        }
                    });
                },
                doneSelected:function (f){
                    scope.mmp.getCurrSelected(function(){
                        var str=',';
                        for(var i=0;i<scope.var.selected_months.length;i++){
                            for(var j=0;j<scope.var.selected_months[i].months.length;j++){
                                str+=','+scope.var.selected_months[i].months[j]+' '+scope.var.selected_months[i].year;
                            }
                        }
                        if(str==','){
                            str='';
                        }
                        f(str.replace(',,',''));	
                    });
                },
                resetSelected:function (){
                    scope.var.selected_months=[];
                    scope.mmp.setSelectedMonths();
                }
            }

            $rootScope.$on('$routeChangeStart',function(){
                $(elem).remove();
            });
            
        }
    }
}).directive('multipleMonthPicker',function($compile){
    return {
        restrict:'C',
        link:function(scope,elem){
            
            $(elem).on('click',function(){
                if($('multiple-month-directive').length>0){
                    $('multiple-month-directive').remove();
                    return false;
                }
                var pos=$(elem).offset();
                var i=1;
                while($('input.multiple-month-picker-'+i).length>0){
                    i++;
                }
                var c='multiple-month-picker-'+i;
                $(elem).addClass(c);
                var el=$compile('<multiple-month-directive data-value="'+this.value+'" data-class="'+c+'" style="top:'+(pos.top+40.0)+'px;left:'+pos.left+'px;"></multiple-month-directive>')(scope);
                $('body').append(el);
            });
        }
    }
})









