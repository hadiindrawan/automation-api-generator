const fs = require('fs');

// check if any file exist
async function isFileExisted(path, fileName, res) {
    const data = fs.readdirSync(path)

    if(data.includes(fileName)) {
        res([true,path])
    } else {
        res([false,path])
        data.forEach((path1) => {
            if(!path1.includes('.')) {
                let path2 = path+'/'+path1
                const data1 = fs.readdirSync(path2)
                if(data1.includes(fileName)) {
                    res([true,path2])
                } else {
                    res([false,path2])
                    data1.forEach((path2) => {
                        if(!path2.includes('.')) {
                            let path3 = path+'/'+path1+'/'+path2
                            const data2 = fs.readdirSync(path3)
                            if(data2.includes(fileName)) {
                                res([true,path3])
                            } else {
                                res([false,path3])
                                data2.forEach((path3) => {
                                    if(!path3.includes('.')) {
                                        let path4 = path+'/'+path1+'/'+path2+'/'+path3
                                        const data3 = fs.readdirSync(path4)
                                        if(data3.includes(fileName)) {
                                            res([true,path4])
                                        } else {
                                            res([false,path4])
                                            data3.forEach((path4) => {
                                                if(!path4.includes('.')) {
                                                    let path5 = path+'/'+path1+'/'+path2+'/'+path3+'/'+path4
                                                    const data4 = fs.readdirSync(path5)
                                                    if(data4.includes(fileName)) {
                                                        res([true,path5])
                                                    } else {
                                                        res([false,path5])
                                                        data4.forEach((path5) => {
                                                            if(!path5.includes('.')) {
                                                                let path6 = path+'/'+path1+'/'+path2+'/'+path3+'/'+path4+'/'+path5
                                                                const data5 = fs.readdirSync(path6)
                                                                if(data5.includes(fileName)) {
                                                                    res([true,path6])
                                                                } else {
                                                                    res([false,path6])
                                                                    data5.forEach((path6) => {
                                                                        if(!path6.includes('.')) {
                                                                            let path7 = path+'/'+path1+'/'+path2+'/'+path3+'/'+path4+'/'+path5+'/'+path6
                                                                            const data6 = fs.readdirSync(path7)
                                                                            if(data6.includes(fileName)) {
                                                                                res([true,path7])
                                                                            } else {
                                                                                res([false,path7])
                                                                                data6.forEach((path7) => {
                                                                                    if(!path7.includes('.')) {
                                                                                        let path8 = path+'/'+path1+'/'+path2+'/'+path3+'/'+path4+'/'+path5+'/'+path6+'/'+path7
                                                                                        const data7 = fs.readdirSync(path8)
                                                                                        if(data7.includes(fileName)) {
                                                                                            res([true,path8])
                                                                                        } else {
                                                                                            res([false,path8])
                                                                                            data7.forEach((path8) => {
                                                                                                if(!path8.includes('.')) {
                                                                                                    let path9 = path+'/'+path1+'/'+path2+'/'+path3+'/'+path4+'/'+path5+'/'+path6+'/'+path7+'/'+path8
                                                                                                    const data8 = fs.readdirSync(path9)
                                                                                                    if(data8.includes(fileName)) {
                                                                                                        res([true,path9])
                                                                                                    } else {
                                                                                                        res([false,path9])
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                }   
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}

module.exports = isFileExisted