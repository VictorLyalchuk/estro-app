import { StarIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useState } from 'react'
import { addUserProductReview } from '../../../services/userProductReview/user-product-review-services';
import { APP_ENV } from '../../../env/config';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../services/custom/format-data';

interface UserProductReviewProps {
    userId?: string;
    productId: number;
    reviews: IUserProductReview[];
    ratings?: IUserProductRating;
    loadReviews: () => Promise<void>;
}
const UserProductReview: React.FC<UserProductReviewProps> = ({ userId, productId, reviews, ratings, loadReviews }) => {
    const baseUrl = APP_ENV.BASE_URL;
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const [showForm, setShowForm] = useState(false)
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')
    const handleFormSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (!userId) {
            console.error('User ID is required');
            return;
        }
        const model: ICreateUserProductReviewDTO = {
            rating: rating,
            content: content,
            userId: userId,
            productId: productId,
        }
        await addUserProductReview(model);
        setShowForm(false)
        setRating(0)
        setContent('')
        if (loadReviews) {
            await loadReviews();
        }
    }

    return (
        <div className="border-t">
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-12">
                <div className="lg:col-span-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('Reviews_Customer')}</h2>

                    <div className="mt-3 flex items-center">
                        <div>
                            <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                        key={rating}
                                        className={classNames(
                                            ratings && ratings?.averageRating > rating ? 'text-yellow-400' : 'text-gray-300',
                                            'h-5 w-5 flex-shrink-0'
                                        )}
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>
                            <p className="sr-only">{ratings?.averageRating} out of 5 stars</p>
                        </div>
                        <p className="ml-2 text-sm text-gray-900">{t('Reviews_Based_on')} {ratings?.totalCount} {t('Reviews_reviews')}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Review data</h3>

                        <dl className="space-y-3">
                            {ratings?.userProductCounts?.map((count) => (
                                <div key={count.rating} className="flex items-center text-sm">
                                    <dt className="flex flex-1 items-center">
                                        <p className="w-3 font-medium text-gray-900">
                                            {count.rating}
                                            <span className="sr-only"> star reviews</span>
                                        </p>
                                        <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                                            <StarIcon
                                                className={classNames(
                                                    count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />

                                            <div className="relative ml-3 flex-1">
                                                <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                                {count.count > 0 ? (
                                                    <div
                                                        className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                                        style={{ width: `calc(${count.count} / ${ratings.totalCount} * 100%)` }}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </dt>
                                    <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                                        {Math.round((count.count / ratings.totalCount) * 100)}%
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">{t('Reviews_Share_your_thoughts')}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {t('Reviews_text')}
                        </p>

                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                        >
                            {t('Reviews_button_Write')}
                        </button>

                        {showForm && (
                            <form onSubmit={handleFormSubmit} className="border-t mt-6 space-y-4 pt-4">
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                        {t('Reviews_Rating')}
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={classNames(
                                                    rating >= star ? 'text-yellow-400' : 'text-gray-300',
                                                    'h-5 w-5 flex-shrink-0 cursor-pointer'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                        {t('Reviews_Review')}
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={4}
                                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="mr-2 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                        {t('Reviews_button_Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        {t('Reviews_button_Submit')}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
                <div className="mt-8 lg:col-span-5 lg:col-start-8 lg:mt-0">
                    <h3 className="sr-only">Recent reviews</h3>

                    <div className="flow-root">
                        <div className="-my-12 divide-y divide-gray-200">
                            {reviews.map((review, index) => (
                                <div key={index} className="py-12">
                                    <div className="flex items-center">
                                        <img src={`${baseUrl}/uploads/${review?.avatar || "user404.webp"}`}
                                            alt={`${review.author}.`} className="h-12 w-12 rounded-full" />
                                        <div className="ml-4">
                                            <h4 className="text-sm font-bold text-gray-900">{review.author}</h4>
                                            <div className="text-xs font-medium text-gray-900">
                                                <h5>{formatDate(review.orderDate, lang)}</h5>
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                    <StarIcon
                                                        key={rating}
                                                        className={classNames(
                                                            review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                                            'h-5 w-5 flex-shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </div>
                                            <p className="sr-only">{review.rating} out of 5 stars</p>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-4 space-y-6 text-base italic text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: review.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserProductReview;