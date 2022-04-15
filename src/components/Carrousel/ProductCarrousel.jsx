import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as starReg } from '@fortawesome/free-regular-svg-icons'
import styles from './productCF.module.css'

const ProductCarrousel = ({ image, title, rating, price }) => {
    const star = Math.floor(rating)


    return (
        <div className={styles.carrousel}>
            <img className={styles.img} src={image} alt={title} />
            <div className={styles.title}>{title.substring(0, 16)}</div>
            <div className={styles.rate}>
                {
                    [...Array(star)].map((e, index) => {
                        return <FontAwesomeIcon key={index} icon={faStar} />
                    })
                }
                {
                    [...Array(5 - star)].map((e, index) => {
                        return <FontAwesomeIcon key={index.toString() + 'b'} icon={starReg} />
                    })
                }
            </div>
            <div className={styles.price}>{price}</div>
        </div>
    )
}

export default ProductCarrousel