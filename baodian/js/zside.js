 /**
 *	DESC:	A Simple Library Based On Zepto, For Mobile Device
 *	AUTHOR:	1203A
 *	SINCE:	2013-04-06
 *	EMAIL:	gao_st@126.com
 */
;( function ( window, $ ) {
	// NO_NEED_LOAD_DATA = [ '#main', '#config' ];
	var DATA_MAPPING = [ 'v', 'css', 'css3', 'js', 'jquery', 'html5', 'php', 'sql', 'srsy', 'about' ];
	var myScroll, searchScroll, historyScroll;
	
	$( document ).ready( function () {
		bindAnchorEvt();
		myScroll = new iScroll('list', { checkDOMChanges: true, fadeScrollbar: true });
		searchScroll = new iScroll('search', { checkDOMChanges: true, fadeScrollbar: true });
		historyScroll = new iScroll('history', { checkDOMChanges: true, fadeScrollbar: true });
		bindSearchEvt();
		bindFooterTapEvt();
		initData();
	});
	
	function bindAnchorEvt () {
		$('#wrapper, #footer, #header').on( 'click', 'a[href]', function ( e ) {
			var tmpId = $(this).attr('href'),
				title = $(this).attr('title');
			
			$( tmpId ).css({
				'-webkit-transition': '-webkit-transform 200ms',
				'-webkit-transform-origin': '0% 0%', 
				'-webkit-transform': 'translate(0%, 0%) scale(1) translateZ(0px)',
				'opacity': 1
			}).siblings().css({
				'-webkit-transition': '-webkit-transform 200ms',
				'-webkit-transform-origin': '0% 0%', 
				'-webkit-transform': 'translate(100%, 0%) scale(1) translateZ(0px)',
				'opacity': 0
			});
			
			e.preventDefault();
			
			// console.log( tmpId )
			reviseTopBar( title, tmpId );
			
			if ( tmpId == '#list' ) {
				tmpId = $(this).attr('id');
				loadDataById( tmpId );
			} else if ( tmpId == '#detail' ) {
				tmpId = $(this).attr('title');
				showDetails( tmpId );
				addToHistory( tmpId );
			} else if ( tmpId == '#history' ) {
				showHistory();
			}
			
		});
	}
	
	function loadDataById( id ) {
		var index;
		/* if ( $.inArray( id, NO_NEED_LOAD_DATA ) > -1 ) {
			return;
		} */
		
		index = $.inArray( id, DATA_MAPPING );
		
		if ( index > -1 ) {
			getData( index );
		}
	}
	
	function getData( index ) {
		var ls = window.localStorage,
			length = ls.length, 
			i,
			tmpKey,
			tmpArr = [];
		
		for ( i=0; i<length; i++ ) {
			tmpKey = ls.key(i);
			if ( tmpKey.indexOf( index ) == 0 ) {
				tmpArr.push( reviseKey( tmpKey ) );				
			}
		}
		renderUL( tmpArr, index );
	}
	
	function renderUL ( arr, index ) {
		var str = '', i, length;
		if ( arr ) {
			length = arr.length;
			for ( i=0; i<length; i++ ) {
				str += '<li><a href="#detail" title="'+index+'_'+arr[i]+'">' + arr[i] + '</a></li>';
			}
		
			// str = '<li><a href="#detail" id="123">' + arr.join('</a></li><li><a href="#detail" id="123">') + '</a></li>';
		}
		$('#list ul').html( str );
		
		myScroll.scrollTo( 0, 0, 100 );
	}
	
	function showDetails( key ) {
		var val = _getValueByKey( key );
		$('#detail').html( '<p>'+val+'</p>' );
	}
	
	function reviseTopBar( title, target ) {
		
		var $leftBtn = $( '#leftBtn' ),
			$rightBtn = $( '#rightBtn' ),
			$header = $('#header'); 
		
		if ( title ) {
			$('#header label').text( reviseKey( title ) );
		} else {
			$('#header label').text( '面试宝典' );
		}
		
		if ( target == '#list' ) {
			$leftBtn.show().attr('href', '#main').removeAttr('title');
			sessionStorage.setItem( 'tmpTitle', title );
		} else if ( target == '#detail' ) {
			$leftBtn.show().attr('href', '#list').attr('title', sessionStorage.getItem('tmpTitle') );
		} else if ( target == '#search' ) {
			// $leftBtn.show();
			$header.hide();
		} else {
			$leftBtn.hide();
			$header.show();
			// $rightBtn.show();
		}
	}
	
	function reviseKey( key ) {
		return key.substring( key.indexOf('_') + 1 );
	}
	
	function bindSearchEvt() {
		var $searchDiv = $('#searchDiv'),
			$searchTxt = $('#searchTxt'),
			val;
		$searchDiv.on( 'click', function () {
			val = $.trim( $searchTxt.val() );
			if ( val != '' ) {
				getSearchResults( val );
			}
		});
	}
	
	function getSearchResults( txt ) {
		var ls = window.localStorage,
			length = ls.length, 
			i,
			tmpKey,
			tmpArr = [];
		
		for ( i=0; i<length; i++ ) {
			tmpKey = ls.key(i);
			if ( tmpKey.toLowerCase().indexOf( txt.toLowerCase() ) > -1 ) {
				tmpArr.push( tmpKey );				
			}
		}
		
		renderSearchUL( tmpArr );
	}
	
	function renderSearchUL ( arr ) {
		var str = '', i, length;
		if ( arr ) {
			length = arr.length;
			for ( i=0; i<length; i++ ) {
				str += '<li><a href="#detail" title="'+arr[i]+'">' + reviseKey( arr[i] ) + '</a></li>';
			}
		
		}
		$('#search ul').html( str );
		
		// searchScroll.refresh();
		// myScroll.scrollTo( 0, 0, 100 );
	}
	
	function bindFooterTapEvt () {
		var $masker = $( '#footer .masker'),
			index;
		$('#footer a').on( 'click', function () {
			index = $(this).index() * 100;
			$masker.css({
				'-webkit-transition': '-webkit-transform 200ms',
				'-webkit-transform-origin': '0% 0%', 
				'-webkit-transform': 'translate('+index+'%, 0%) scale(1) translateZ(0px)'
			});
		});
	}
	
	function initData () {
		var baseUrl = 'http://localhost/baodian/data/';
		var ls = window.localStorage, val;
		if ( ls ) {
			val = ls.getItem( 'v' );
		}

		$.get( baseUrl + 'version.json?t='+new Date().getTime(), function ( data ) {
			if ( !val || data.v > val ) { // &&
				console.log( 'init data...' );
				$.ajax({
					url: baseUrl + 'data.js?t='+new Date().getTime(),
					dataType: 'jsonp'
				});
			}
		});
	}
	
	function addToHistory ( key ) {
		var h = _getValueByKey( 'h' ), hObj = JSON.parse( h );
		hObj.push( key );
		_setValueByKey( 'h', JSON.stringify( hObj ) );
		// console.log( hObj );
	}
	
	function showHistory () {
		var arr = _getValueArrayByKey( 'h' ).reverse(), 
			i, len = arr.length, str = '';
		for ( i=0; i<len; i++ ) {
			str += '<li><a href="#detail" title="'+arr[i]+'">' + reviseKey( arr[i] ) + '</a></li>';
		}
		$('#history ul').html( str );
	}
	
	function _getValueByKey ( key ) {
		var ls = window.localStorage, val;
		if ( key ) {
			val = ls.getItem( key );
			return val;
		}
	}
	
	function _setValueByKey ( key, val ) {
		var ls = window.localStorage;
		ls.setItem( key, val );
	}
	
	function _getValueArrayByKey ( key ) {
		var ls = window.localStorage, arr;
		arr = JSON.parse( ls.getItem( key ) );
		return arr;
	}
})( window, Zepto );