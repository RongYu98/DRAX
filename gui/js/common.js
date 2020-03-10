$( document ).ready(function() {
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
    
    // target : result items
    // event handler which hides/shows .item-info div whenever .list-group-item button is clicked
    $(".list-group-item").on("click", function(){
        var target = $(this);
        var isDisplayed = target.next().css("display");
        if(isDisplayed == "none"){
            target.next().css("display", "flex");
        }
        else{
            target.next().hide();
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
    
    // target : sort by college recommendation button
    // event handler which disables sort by college recommendation button once it is clicked
    $("#sort-btn").on("click", function(){
        $("#sort-btn").prop("disabled", true);
    });
});