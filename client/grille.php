<?php
function genererGrille($elementsGrille, $tailleGrille) // 10 et 500
{
	$gap = $tailleGrille/($elementsGrille+1);

	$grille = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'.$tailleGrille.'" height="'.$tailleGrille.'">';

	$lettre = 'A';
	for ($i = 0 ; $i <= $elementsGrille ; $i++)
	{
		for ($j = 0 ; $j <= $elementsGrille ; $j++)
		{
			if ($i > 0 && $j > 0)
			{
				$identification = 'title="'.$lettre.($j).'" id="case_'.$lettre.($j).'"';
				$grille .= '<rect '.$identification.' fill="none" stroke="black" stroke-width="1" x="'.($i*$gap+1.5).'" y="'.($j*$gap+1.5).'" width="'.($gap-3).'" height="'.($gap-3).'"/>'."\n";
			}
		}
		if ($i > 0) $lettre++;
	}



	$lettre = 'A';
	$x = ($gap*1.5);
	for ($i = 0 ; $i < $elementsGrille ; $i++)
	{
		$grille .= '<text x="'.$x.'" y="'.($gap/2).'" style="text-anchor:middle; dominant-baseline: central;">'.$lettre++.'</text>'."\n";
		$grille .= '<text x="'.($gap/2).'" y="'.$x.'" style="text-anchor:middle; dominant-baseline: central;">'.($i+1).'</text>'."\n";
		$x += $gap;
	}
		  
	$grille .= '</svg>';
	return $grille;
}
