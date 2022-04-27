
function buildProdLogger() {
     jest.fn().mockImplementation(function() {  
        return {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn()
        };
      });
    
    }
module.exports = buildProdLogger;
