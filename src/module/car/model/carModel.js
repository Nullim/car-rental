const { DataTypes, Model } = require('sequelize')

class CarModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static initialize(sequelizeInstance) {
    CarModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          unique: true
        },
        brand: {
          type: DataTypes.STRING,
          allowNull: false
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        kms: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0
          }
        },
        color: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ac: {
          type: DataTypes.STRING,
          allowNull: false
        },
        passengers: {
          type: DataTypes.STRING,
          allowNull: false
        },
        transmission: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          validate: {
            min: 1
          }
        },
        img: {
          type: DataTypes.INTEGER,
        }
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Car',
        underscored: true,
        paranoid: true
      }
    );

    return CarModel;
  }
}

module.exports = CarModel;
