<?php

namespace ThemeHouse\Giphy\XF\Pub\Controller;

use ThemeHouse\Giphy\Util\Giphy;

/**
 * Class Misc
 * @package ThemeHouse\Giphy\XF\Pub\Controller
 */
class Misc extends XFCP_Misc
{
    /**
     * @return \XF\Mvc\Reply\View
     */
    public function actionGiphyApi()
    {
        $query = $this->filter('q', 'str');
        $limit = $this->filter('limit', 'uint');
        $offset = $this->filter('offset', 'uint');

        $results = Giphy::loadResults($query, $limit, $offset);

        $this->setResponseType('json');
        $viewParams = [
            'results' => $results,
        ];
        return $this->view('ThemeHouse\Giphy:Misc\GiphyApi', '', $viewParams);
    }
}