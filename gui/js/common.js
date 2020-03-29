$( document ).ready(function() {
    $('.carousel').carousel('pause');
    
    // target : filters button
    // event handler which hides/shows filters
    $('#filters-dropdown-btn').on("click", function(){
        var isDisplayed =  $("#filters-dropdown-content").css('display')
        if(isDisplayed == "none"){
            $('#filters-dropdown-content').css("display", "flex");
        }
        else{
            $('#filters-dropdown-content').hide();     
        }
    });

    // target : slider value label
    // event handler which shows current slider value whenever the slider pivot is moving
    $("input").on("input", function(){
        // search college -> ranking filter input
        if(this.id == "ranking"){
            if($("#ranking").val() == 0){
                $("#ranking-val").html("-");
            }
            else if($("#ranking").val() == 601){
                $("#ranking-val").html("600+");
            }
            else{
                $("#ranking-val").html($("#ranking").val());
            }
        }
    });
    
    // target : result items in every page except search college page
    // event handler which hides/shows .item-info tag/.carousel tag whenever button.list-group-item is clicked
    $("button.list-group-item").on("click", function(){
        var target = $(this);
        var isDisplayed = target.next().css("display");
        if(isDisplayed == "none"){
            target.next().css("display", "flex");
        }
        else{
            target.next().hide();
        }
    });

    // target : result items in search college page
    // event handler which hides/shows .item-info tag whenever div.list-group-item > .college-name is clicked
    $("div.list-group-item .college-name").on("click", function(){
        var target = $(this);
        var isDisplayed = target.parent().next().css("display");
        if(isDisplayed == "none"){
            target.parent().next().css("display", "flex");
        }
        else{
            target.parent().next().hide();
        }
    });

    // target : pagination buttons
    // event handler which add "active" class to clicked pagination button
    $(".page-item > button").on("click", function(){
        var target = $(this);
        $('.page-item > button').each(function(index, value) {
            $(this).removeClass("active");
        });
        target.addClass("active");
    });
    
    // target : scatterplot modal buttons
    // event handler which add "blocked" attribute to clicked scatterplot modal button
    $(".plot-modal-option-btn").on("click", function(){
        var target = $(this);
        $('.plot-modal-option-btn').each(function(index, value) {
            $(this).removeAttr("disabled");
        });
        target.attr('disabled', 'disabled');
    });

    // target : filters
    // event handler which hides filter box when search button is clicked
    $("#search-btn").on("click", function(){
        var target = $("#filters-dropdown-content");
        target.css("display", "none");
    });
});