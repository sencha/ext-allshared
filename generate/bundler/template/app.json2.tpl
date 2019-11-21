{
    "packagename": "{packagename}",
    "buildfolder": "build",
    "manifestfolder": "manifest",

    "name": "bundler",
    "framework": "ext",
    "toolkit": "modern",
    "theme": "theme-triton",
    "output": {
        "base": "./build/$\u007Bapp.packagename}",
        "resources": {
            "path": "./"
        }
    },
    "css": [
        {
            "path": "$\u007Bbuild.out.css.path}",
            "bundle": true,
            "exclude": ["fashion"]
        }
    ],
    "production": {
        "output": {
            "appCache": {
                "enable": true,
                "path": "cache.appcache"
            }
        },
        "loader": {
            "cache": "$\u007Bbuild.timestamp}"
        },
        "cache": {
            "enable": true
        },
        "compressor": {
            "type": "closure",
            "compression": "advanced"
        }
    }
}
