export const LayerConfig = [
	{
		'layerId': '-1',
		'layerName': '地图标志',
		'layerType': 'service',
		'checked': false,
		'layerConfig': {
			type: 'Inner',
			category: 'Annotion',
			url: 'TianDiTuWMTS.Normal.Annotion',
			options: {
				token: '2d02a4bf00cfa355abc3f7f7850dfcc7'
			}
		}
	},
  	{
		'layerId': '-2',
		'layerName': '全球国家行政边界',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/borders/wms',
			'type': 'WMS',
			'layers': 'borders:G_country_borders',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	},
  	{
		'layerId': '1',
		'layerName': 'windFarms',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
			'type': 'WMS',
			'layers': 'Infrastructure:C_wind_farm',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	},
  	{
		'layerId': '2',
		'layerName': 'windStation',
		'layerConfig': {
		'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
		'type': 'WMS',
		'layers': 'Infrastructure:C_weather_station',
		'transparent': 'true',
		'format': 'image/png',
		'version': '1.1.0'
		},
		'styleConfig': {
		'styleType': 'default',
		'opacity': 100
		}
	},
  	{
		'layerId': '3',
		'layerName': 'windRedLine',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/environment/wms',
			'type': 'WMS',
			'layers': 'environment:C_eco_redline',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	},
  	{
		'layerId': '4',
		'layerName': 'windNature',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/environment/wms',
			'type': 'WMS',
			'layers': 'environment:C_natural_reservation',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	},
	{
		'layerId': '5',
		'layerName': 'windHousing',
		'layerConfig': {
		'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
		'type': 'WMS',
		'layers': 'Infrastructure:C_residential',
		'transparent': 'true',
		'format': 'image/png',
		'version': '1.1.0'
		},
		'styleConfig': {
		'styleType': 'default',
		'opacity': 100
		}
	},
  	{
		'layerId': '10',
		'layerName': 'windLinearWater',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/topography/wms',
			'type': 'WMS',
			'layers': 'topography:C_river_line',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		  },
		  'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		  }
	},
  	{
		'layerId': '6',
		'layerName': 'windSurfaceWater',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/topography/wms',
			'type': 'WMS',
			'layers': 'topography:C_river',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	},
	// {
	// 	'layerId': '7',
	// 	'layerName': 'windHighway',
	// 	'layerType': 'service',
	// 	'checked': false
	// },
	// {
	// 	'layerId': '8',
	// 	'layerName': 'windProvincial',
	// 	'layerType': 'service',
	// 	'checked': false
	// },
  	{
		'layerId': '9',
		'layerName': 'windRoad',
		'layerConfig': {
			'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
			'type': 'WMS',
			'layers': 'Infrastructure:Chind_road_line',
			'transparent': 'true',
			'format': 'image/png',
			'version': '1.1.0'
		},
		'styleConfig': {
			'styleType': 'default',
			'opacity': 100
		}
	}
]

