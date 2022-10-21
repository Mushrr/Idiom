const { logger } = require("../../../../middlewares/logger")
const { dataTransform } = require('../../../../utils/utils');


function coreLogger(core) {


    return {
        name: "core-logger",
        core: core,

        onreturn(data, instruction) {
            if (!instruction[this.name].skip) {
                try {
                    if (data instanceof Promise) {
                        data.then((res) => {
                            logger.info(`[${this.name}]:`, dataTransform(res).data);
                        }).catch(err => {
                            logger.error(`[${this.name}:`, dataTransform(err).data);
                        })
                    } else {
                        logger.info(`[${this.name}]:`, dataTransform(data).data);
                    }
                } catch (err) {
                    logger.error(`[${this.name}]:`, dataTransform(err).data);
                }
            }
        }
    }
}

module.exports = coreLogger;