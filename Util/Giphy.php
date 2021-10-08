<?php

namespace ThemeHouse\Giphy\Util;

/**
 * Class Giphy
 * @package ThemeHouse\Giphy\Util
 */
class Giphy
{
    /**
     * @param $query
     * @param $limit
     * @param $offset
     * @return array
     */
    public static function loadResults($query, $limit, $offset)
    {
        if ($limit === 0) {
            $limit = 10;
        }

        $client = \XF::app()->http()->createClient();

        $options = \XF::options();

        try {
            /** @noinspection PhpParamsInspection */
            $response = $client->get('https://api.giphy.com/v1/gifs/search', [
                'query' => [
                    'api_key' => $options->th_apiKey_giphy,
                    'q' => $query,
                    'limit' => $limit,
                    'offset' => $offset,
                    'rating' => $options->th_rating_giphy
                ]
            ]);

            if ($response->getStatusCode() != 200) {
                return self::prepareResponse();
            }

            $contents = $response->getBody()->getContents();
            $responseData = json_decode($contents, true);

            return self::prepareResponse($responseData);
        } catch (\Exception $e) {
            return self::prepareResponse();
        }
    }

    /**
     * @param array $response
     * @return array
     */
    protected static function prepareResponse(array $response = [])
    {
        $cleanResponse = [
            'data' => [],
            'pagination' => [
                'total_count' => 0,
                'count' => 0,
                'offset' => 0,
            ],
        ];

        if (!empty($response['data'])) {
            $cleanResponse['data'] = $response['data'];
        }

        if (!empty($response['pagination'])) {
            $cleanResponse['pagination'] = $response['pagination'];
        }

        return $cleanResponse;
    }
}