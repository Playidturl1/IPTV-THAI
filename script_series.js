let playlistCurent = player = player2 = json = urlIframe = urlm3u8 = MU_type = MU_group = null;
let startAds = true;
let myTimer;
let myTimer1;
let playAds = 'play';
let e_beforeplay = 0;
let firstPlay = 0;

//สร้าง Player Ads
function createPlayer() {
  reset();

  let episodeId = $('#series-episode option:selected').val();
  let seasonId = $('#series-season option:selected').val();
  let soundNow = $('.mov_sound.active').data('sound');
  let sourdId = $('.mov_source.active').data('id');
  let data = movieList['seasonList'][seasonId]['epList'][episodeId]['link'][soundNow][sourdId];

  urlIframe = data.MU_url; urlm3u8 = data.org_url; MU_type = data.MU_type; MU_group = data.MU_group;
  if (data.MU_ads == "true" && playlist != null && playAds == 'play' && lads != 'no') {
    setupPlayer(data);
  } else {
    $('#group-sound').show();
    $('#group-url').show();
    playMovie();
  }
}

//สร้างปุ่มเสียง
function createButtonSound() {
  //Episode ปัจจุบัน
  let episodeId = $('#series-episode option:selected').val();
  let seasonId = $('#series-season option:selected').val();
  let sound = movieList['seasonList'][seasonId]['epList'][episodeId]['sound'];
  let btnThai = btnEng = "";

  let btn = '';
  sound.forEach(soundType => {
    if(soundType =='thai'){
      btn += "<button class='mov_sound' data-sound='thai'>พากย์ไทย</button>";
    }else if(soundType =='sub'){
      btn += "<button class='mov_sound' data-sound='sub'>Soundtrack</button>";
    }else if(soundType =='subthai'){
      btn += "<button class='mov_sound' data-sound='subthai'>ซับไทย</button>";
    }else if(soundType =='thai-subthai'){
      btn += "<button class='mov_sound' data-sound='thai-subthai'>พากย์ไทย+ซับไทย</button>";
    }
    
  });
  // if (sound[0] == 'thai') {
  //   btnThai = "<button class='mov_sound' data-sound='thai'>พากย์ไทย</button>";
  //   if (typeof sound[1] !== 'undefined' && sound[1] == 'sub') { btnEng = "<button class='mov_sound' data-sound='sub'>Soundtrack</button>"; }
  // } else if (sound[0] == 'sub') { btnEng = "<button class='mov_sound' data-sound='sub'>Soundtrack</button>"; }
  
  
  $('#group-sound').html(btn);
  $('.mov_sound').first().addClass('active');
  createButtonLink();
}

//ฟังก์ชั่นสร้างปุ่มเลือกลิงค์หนัง
function createButtonLink() {
  let seasonId = $('#series-season option:selected').val();
  let episodeId = $('#series-episode option:selected').val();
  let soundNow = $('.mov_sound.active').data('sound');
  let urlList = movieList['seasonList'][seasonId]['epList'][episodeId]['link'][soundNow];

  let btnplayMain = '';
  let btnplaySlave = '';
  for (let index = 0; index < urlList.length; index++) {

    var label = "";
    if (index == 0) {
      label = 'เล่นหลัก';
    } else {
      if (urlList[index]['MU_type'] == 'm3u' || urlList[index]['MU_type'] == 'MP4') {
        label = 'ตัวเล่นเทพ';
      } else {
        if (urlList[index]['MU_group'] == 'P2P') { label = 'ตัวเล่นสำรอง'; }
        else if (urlList[index]['MU_group'] == 'Youtube') { label = 'ตัวเล่นเร็ว'; }
        else if (urlList[index]['MU_group'] == 'imovie') { label = 'BETA'; }
        else { label = 'สำรอง'; }
      }
    }

    if (urlList[index]['MU_group'] == 'PhotoHls') {
      btnplayMain += '<button class="mov_source" data-id="' + index + '">' + label + '</button>';
    } else {
      btnplaySlave += '<button class="mov_source" data-id="' + index + '">' + label + '</button>';
    }
  }
  $('#group-url').html(btnplayMain + btnplaySlave);
  $('.mov_source').first().addClass('active');
  if (playAds == 'play' && playlist != null) { $('.loading').show(); setTimeout(() => { createPlayer(); }, 300); } else { createPlayer(); }
}

function creatEpList() {
  let seasonId = $('#series-season option:selected').val();
  let ep_id = $('#episode_id').val();
  $("#series-episode").html('');
  $('#series-episode').selectpicker('refresh');
  $.each(movieList['seasonList'][seasonId]['epName'], function (index, value) {
    // console.log('epID => ;'+ep_id+ 'index => '+index);
    if ('EP' + ep_id == index) {
      console.log('yes');
      $("#series-episode").append('<option class="select-active" selected value="' + index + '">' + value + '</option>');
    } else {
      $("#series-episode").append('<option value="' + index + '">' + value + '</option>');
    }
  });
  $('#series-episode').selectpicker('refresh');
  // $('#series-episode:first').addClass('select-active');

  createButtonSound();
}

$(document).ready(function () {
    
       document.addEventListener('contextmenu', event => event.preventDefault());
 
devtoolsDetector.addListener(function (isOpen, detail) {
        if (isOpen) {
            console.clear();
           
        }
    });
    devtoolsDetector.launch(); 

  $('body').on('click', '.ad-overlay-click', function () {
    // console.log('ad-overlay-click');

    if (firstPlay == 0) {
      firstPlay = 1;
    } else {
      $('.btn-ad-link')[0].click();
    }
  });

  //สร้าง Season dropdown
  let ss_id = $('#season_id').val();
  $.each(movieList['seasonName'], function (index, value) {
    if (('ID' + ss_id) == index) {
      $("#series-season").append('<option class="select-active" selected value="' + index + '">' + value + '</option>');
    } else {
      $("#series-season").append('<option value="' + index + '">' + value + '</option>');
    }
  });
  $('#series-season').selectpicker('refresh');
  if (ss_id == "") {
    $('#series-season:first').addClass('select-active');
  }

  creatEpList(); //สร้างรายการ Episode
  $('#series-season').on('change', creatEpList);
  $('#series-episode').on('change', createButtonSound);

  //คลิกสลับเสียง
  $('body').on('click', '.mov_sound', function () {
    $('.ad-player-skip').remove(); $('.mov_sound.active').removeClass('active'); $(this).addClass('active');
    createButtonLink();
  });

  //คลิกปุ่มลิงค์หนัง
  $('body').on('click', '.mov_source', function () {
    $('button.mov_source').removeClass('active'); $(this).addClass('active');
    if (playAds == 'play' && playlist != null) {
      $('.loading').show(); setTimeout(() => { createPlayer(); }, 300);
    } else { createPlayer(); }
  });

});

//ฟังก์ชั่นนับถอยหลัง
function clock() {
  clearInterval(myTimer);
  let c1 = 4;
  function myClock() {
    c1--;
    // console.log(c1);
    if (c1 <= 0) {
      clearInterval(myTimer); $('.btn-skip span').html('ข้ามโฆษณา');
    } else { $('.btn-skip span').html('กดข้ามได้ใน (' + c1 + ')'); }
  }

  myClock();
  myTimer = setInterval(myClock, 1000);
}


//เตรียมเล่นโฆษณา
function setupPlayer() {
  player = jwplayer("video_container1").setup({ "playlist": playlist, "mute": false, "enableFullscreen": 'false', "autostart": "false", "preload": "auto", primary: 'html5', "volume": 90, androidhls: true });

  player.on('ready', function (event) {
    //เปลี่ยนรูป cover
    $('.jw-preview').css('background-image', 'url(' + playerConfig.cover + ')');
    $('#group-sound').show();
    $('#group-url').show();
  });

  //เมื่อกดหยุดคลิปให้เล่นคลิปต่อ
  player.on('pause', function (event) { player.play(); });

  player.on('error', function (event) {
    // console.log(`error`);
    forceNext();
  });



  player.on('play', function (event) {
    if (e_beforeplay == 0) {
      e_beforeplay = 1;
      // console.log('beforePlay'); 

      if ($('.ad-player-skip').length == 0) {
        $('#moviePlayer').append('<div class="ad-player-skip"><div class="ad-overlay-click"></div><div class="ad-player-link"><a href="#" target="_blank" class="btn btn-ad-link">สมัครสมาชิก</a></div><button class="btn btn-skip" onclick="next(this)"><span></span></button></div>');
      }
      clock();
      playAds = 'donplay';

      $('.btn-ad-link').attr('href', playlist[player.getPlaylistIndex()]['sources'][0].clickUrl);

    }

  });

  player.on('playlistItem', function (event) { playlistCurent = event; });

  //เล่น play จบ ทั้งหมด
  player.on('playlistComplete', playMovie);
}
function next(event) {
  e_beforeplay = 0;
  if ($(event).find('span').html() != 'ข้ามโฆษณา') { return false; }
  $('.btn-skip span').html('กดข้ามได้ใน');

  //ข้าม
  forceNext();
}

//ข้าม ads
const forceNext = () => {

  clearInterval(myTimer);
  e_beforeplay = 0;
  let playIndex = player.getPlaylistIndex();
  if (playIndex == playlist.length - 1) {
    playMovie();
  } else {
    player.next();
  }

}


//เคลียร์ค่าเป็นเริ่มต้น
function reset() {
  if (player != null) { player.remove(); player = null; }
  if (player2 != null) { player2.remove(); player2 = null; }

  $('.player-embed').remove();
  $('.ad-player-skip').remove(); $('#video_container1').hide(); $('#video_container2').hide(); $('.loading').hide();
}

//ตรวจสอบเงื่อนไขการเล่นหนัง
function playMovie() {
  initiframe(urlIframe, MU_group);
}

function initiframe(url, group = 'P2P') {
  reset();
  let seek_param = '';
  // if (seek != '') { seek_param = '&seek=' + seek; }

  $('.player-embed').remove();
  $('#moviePlayer').append('<iframe style="width:99%;" src="'+url+'" allowfullscreen="allowfullscreen" scrolling="no" frameBorder="0" class="player-embed dropdown" ></iframe>');
  
  $('.player-embed').show();
  $('.player-embed').on('load', function(){$(this).css('width','100%');});


  // $('.player-embed').attr('src', url).show();
  // $('.player-embed').on('load', function () { $(this).css('width', '100%'); });
}
